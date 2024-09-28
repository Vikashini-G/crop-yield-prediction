from flask import Flask, request, jsonify  
from flask_cors import CORS
import pickle
import pandas as pd
import xgboost as xgb

app = Flask(__name__)

CORS(app)
expected_columns = [
    'State_Name_andhra pradesh', 
    'State_Name_other',  
    'Crop_Type_kharif',
    'Crop_Type_rabi', 
    'Crop_Arhar/Tur',
    'rainfall',
    'temperature',
    'Area_in_hectares'
]

model_xgb = pickle.load(open('xgb.pkl', 'rb'))
ytr= pd.read_csv('model/Final_Dataset_after_temperature.csv')
X=ytr.drop(["Yield_ton_per_hec", "Production_in_tons"],axis=1)
X_encoded=pd.get_dummies(X)

@app.route('/predict', methods=['POST'])

def predict():
    data = request.get_json()

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

    custom_input_encoded = custom_input_encoded.reindex(columns=X_encoded.columns, fill_value=0)
    custom_dmatrix = xgb.DMatrix(custom_input_encoded)
    y_pred_custom = model_xgb.predict(custom_dmatrix)
    if float(y_pred_custom) < 0:
        return 241.2
    prediction = float(y_pred_custom)

    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run()
