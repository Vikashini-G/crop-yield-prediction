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

@app.route('/predict', methods=['POST'])

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

    # Call the pred() function to get the prediction
    prediction = pred(model_xgb, custom_input)

    # Return the prediction as JSON
    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run()
