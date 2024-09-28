import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './CropForm.css';
import stateIcon from "../images/location.png";
import cloudIcon from '../images/cloud.png';
import plantIcon from '../images/plant.png';
import tempIcon from '../images/temp1.png';
import rulerIcon from '../images/ruler.png';

const CropForm = ({ setPrediction }) => {
    const [stateName, setStateName] = useState('');
    const [cropType, setCropType] = useState('');
    const [crop, setCrop] = useState('');
    const [rainfall, setRainfall] = useState('');
    const [temperature, setTemperature] = useState('');
    const [areaInHectares, setAreaInHectares] = useState('');

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
            const response = await fetch('http://127.0.0.1:5000/predict', {  
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cropData),
            });

            const data = await response.json();
            setPrediction(data.prediction);  
            console.log('Prediction received:', data.prediction);

            await addDoc(collection(db, "crops"), {
                ...cropData,
                prediction: data.prediction,  
                timestamp: new Date(),
            });

            console.log('Crop data added to Firestore');
            // alert('Crop data submitted successfully!');
        } catch (error) {
            console.error("Error adding document: ", error.message);
            alert('Failed to submit crop data');
        }
    };

    return (
        <div className="crop-form">
            <h2>Predict your crop yield</h2>
            <form onSubmit={handleSubmit}>
                <div class="crop-details">
                    <h4>Crop Details</h4>
                    <label>
                    <img 
                        src={stateIcon}
                        alt="map icon" 
                        style={{ height: '17px', marginRight: '8px', verticalAlign: 'middle'}} 
                    />
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
                        <img 
                            src={plantIcon}
                            alt="map icon" 
                            style={{ height: '20px', marginRight: '8px', verticalAlign: 'middle'}} 
                        />
                        Enter crop name:
                        <input 
                            type="text" 
                            name="crop" 
                            value={crop} 
                            onChange={(e) => setCrop(e.target.value)} 
                        />
                    </label>
                </div>
                <div class="condition-details">
                    <h4>Farm conditions</h4>
                    <label>
                        <img 
                            src={cloudIcon}
                            alt="map icon" 
                            style={{ height: '20px', marginRight: '8px', verticalAlign: 'middle'}} 
                        />
                        Enter rainfall (in mm):
                        <input 
                            type="number" 
                            name="rainfall" 
                            value={rainfall} 
                            onChange={(e) => setRainfall(e.target.value)} 
                        />
                    </label>
                    <label>
                        <img 
                            src={tempIcon}
                            alt="map icon" 
                            style={{ height: '22px', marginRight: '8px', verticalAlign: 'middle'}} 
                        />
                        Enter temperature (in °C):
                        <input 
                            type="number" 
                            name="temperature" 
                            value={temperature} 
                            onChange={(e) => setTemperature(e.target.value)} 
                        />
                    </label>
                    <label>
                        <img 
                            src={rulerIcon}
                            alt="map icon" 
                            style={{ height: '22px', marginRight: '8px', verticalAlign: 'middle'}} 
                        />
                        Enter area (in hectares):
                        <input 
                            type="number" 
                            name="areaInHectares" 
                            value={areaInHectares} 
                            onChange={(e) => setAreaInHectares(e.target.value)} 
                        />
                    </label>
                </div>
                <button type="submit">Predict Crop Yield</button>
            </form>
        </div>
    );
};

export default CropForm;