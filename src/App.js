import React, { useState } from 'react';
import HistoryPanel from './components/HistoryPanel';
import CropForm from './components/CropForm';
import PredictionPanel from './components/PredictionPanel';
import Chatbot from './chatBot/ChatBot';
import './App.css';

function App() {
    const [prediction, setPrediction] = useState(null);

    return (
        <div className="app">
            <HistoryPanel />
            <div className="main-content">
                <div className="prediction-card">
                    <CropForm setPrediction={setPrediction} />
                    <PredictionPanel prediction={prediction} />
                </div>
                
            </div>
            <Chatbot />
        </div>
    );
}

export default App;
