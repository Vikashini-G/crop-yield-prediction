import React, { useState } from 'react';
import HistoryPanel from './components/HistoryPanel';
import CropForm from './components/CropForm';
import PredictionPanel from './components/PredictionPanel';
import Chatbot from './chatBot/ChatBot';
import TranslateComponent from "./components/TranslateComponent";
import './App.css';

function App() {
    const [prediction, setPrediction] = useState(null);

    return (
        <div className="app">
            <div className='translate'>
                <TranslateComponent/>
            </div>
            <div className='rest'>
                <HistoryPanel />
                <div className="main-content">
                    <div className="prediction-card">
                        <CropForm setPrediction={setPrediction} />
                        <PredictionPanel prediction={prediction} />
                    </div>
                </div>
                <Chatbot />
            </div>
            
        </div>
    );
}

export default App;
