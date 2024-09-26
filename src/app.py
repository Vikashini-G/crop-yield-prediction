from flask import Flask, request, jsonify  # Added jsonify to return JSON responses
from flask_cors import CORS
import pickle
import pandas as pd
import xgboost as xgb

app = Flask(__name__)

CORS(app)
expected_columns = [
    'State_Name_andhra pradesh', 
    'State_Name_other',  # Add other states as necessary
    'Crop_Type_kharif',
    'Crop_Type_rabi',  # Add other crop types as necessary
    'Crop_Arhar/Tur',
    'rainfall',
    'temperature',
    'Area_in_hectares'
]
# Load your trained model
model_xgb = pickle.load(open('xgb.pkl', 'rb'))
ytr= pd.read_csv('model/Final_Dataset_after_temperature.csv')
X=ytr.drop(["Yield_ton_per_hec", "Production_in_tons"],axis=1)
X_encoded=pd.get_dummies(X)
@app.route('/predict', methods=['POST'])
# def pred(model_xgb,input_data):
#     custom_input_df = pd.DataFrame([input_data])
#     custom_input_encoded = pd.get_dummies(custom_input_df)

# # # Align the custom input with the training set to ensure it has the same columns
#     custom_input_encoded = custom_input_encoded.reindex(columns=X_encoded.columns, fill_value=0)
#     custom_dmatrix = xgb.DMatrix(custom_input_encoded)
#     y_pred_custom = model_xgb.predict(custom_dmatrix)
#     #print(f'Predicted Production in tons: {y_pred_custom[0]}')
    # return y_pred_custom[0]
def predict():
    # Get the JSON data from the request
    data = request.get_json()

    # Prepare the input dictionary
    custom_input = {
        'State_Name': data['State_Name'],
        'Crop_Type': data['Crop_Type'],
        'Crop': data['Crop'],
        'rainfall': float(data['rainfall']),
        'temperature': float(data['temperature']),
        'Area_in_hectares': float(data['Area_in_hectares'])
    }
    custom_input_df = pd.DataFrame([custom_input])
    custom_input_encoded = pd.get_dummies(custom_input_df)

# # Align the custom input with the training set to ensure it has the same columns
    custom_input_encoded = custom_input_encoded.reindex(columns=X_encoded.columns, fill_value=0)
    custom_dmatrix = xgb.DMatrix(custom_input_encoded)
    y_pred_custom = model_xgb.predict(custom_dmatrix)
    # Call the pred() function to get the prediction
    prediction = float(y_pred_custom) #pred(model_xgb, custom_input)

    # Return the prediction as JSON
    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run()
