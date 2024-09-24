import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './CropForm.css';

const CropForm = () => {
    const [cropType, setCropType] = useState('');
    const [region, setRegion] = useState('');
    const [season, setSeason] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const historyDocRef = await addDoc(collection(db, "crops"),{
                cropType: cropType,
                region: region,
                season: season,
                timestamp: new Date()
            });

            console.log('History document added');

            setCropType('');
            setRegion('');
            setSeason('');

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
                    Enter crop type:
                    <input 
                        type="text" 
                        name="cropType" 
                        value={cropType} 
                        onChange={(e) => setCropType(e.target.value)} 
                    />
                </label>
                <label>
                    Enter region:
                    <input 
                        type="text" 
                        name="region" 
                        value={region} 
                        onChange={(e) => setRegion(e.target.value)} 
                    />
                </label>
                <label>
                    Enter season:
                    <input 
                        type="text" 
                        name="season" 
                        value={season} 
                        onChange={(e) => setSeason(e.target.value)} 
                    />
                </label>
                <button type="submit">Predict Crop Yield</button>
            </form>
        </div>
    );
};

export default CropForm;
