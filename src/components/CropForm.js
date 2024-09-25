import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './CropForm.css';

const CropForm = () => {
    const [stateName, setStateName] = useState('');
    const [cropType, setCropType] = useState('');
    const [crop, setCrop] = useState('');
    const [rainfall, setRainfall] = useState('');
    const [temperature, setTemperature] = useState('');
    const [areaInHectares, setAreaInHectares] = useState('');
    const [prediction, setPrediction] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cropData = {
            State_Name: stateName,
            Crop_Type: cropType,
            Crop: crop,
            rainfall: parseFloat(rainfall),
            temperature: parseFloat(temperature),
            Area_in_hectares: parseFloat(areaInHectares),
        };

        console.log('Sending data to backend:', cropData); 

        try {
            // Save to Firestore (optional)
            await addDoc(collection(db, "crops"), {
                ...cropData,
                timestamp: new Date(),
            });
            // await addDoc(collection(db, "crops"), {
            //     State_Name: stateName,
            //     Crop_Type: cropType,
            //     Crop: crop,
            //     rainfall: rainfall,
            //     temperature: temperature,
            //     Area_in_hectares: areaInHectares,
            //     timestamp: new Date()
            // });

            console.log('Crop data added to Firestore');

            // API call to send form data to the backend and get prediction
            const response = await fetch('http://127.0.0.1:5000/predict', {  
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cropData),
            });

            const data = await response.json();
            setPrediction(data.prediction);  // Set the prediction from the API response

            alert('Crop data submitted successfully!');
        } catch (error) {
            console.error("Error adding document: ", error.message);
            alert('Failed to submit crop data');
        }
    };

    return (
        <div className="crop-form">
            <p>Predict your crop yield</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Enter state name:
                    <input 
                        type="text" 
                        name="stateName" 
                        value={stateName} 
                        onChange={(e) => setStateName(e.target.value)} 
                    />
                </label>
                <label>
                    Enter crop type:
                    <input 
                        type="text" 
                        name="cropType" 
                        value={cropType} 
                        onChange={(e) => setCropType(e.target.value)} 
                    />
                </label>
                <label>
                    Enter crop name:
                    <input 
                        type="text" 
                        name="crop" 
                        value={crop} 
                        onChange={(e) => setCrop(e.target.value)} 
                    />
                </label>
                <label>
                    Enter rainfall (in mm):
                    <input 
                        type="number" 
                        name="rainfall" 
                        value={rainfall} 
                        onChange={(e) => setRainfall(e.target.value)} 
                    />
                </label>
                <label>
                    Enter temperature (in °C):
                    <input 
                        type="number" 
                        name="temperature" 
                        value={temperature} 
                        onChange={(e) => setTemperature(e.target.value)} 
                    />
                </label>
                <label>
                    Enter area (in hectares):
                    <input 
                        type="number" 
                        name="areaInHectares" 
                        value={areaInHectares} 
                        onChange={(e) => setAreaInHectares(e.target.value)} 
                    />
                </label>
                <button type="submit">Predict Crop Yield</button>
            </form>
            {prediction && (
                <div>
                    <h3>Predicted Crop Yield:</h3>
                    <p>{prediction} tons</p>
                </div>
            )}
        </div>
    );
};

export default CropForm;
