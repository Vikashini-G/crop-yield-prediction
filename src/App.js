import React from 'react';
import HistoryPanel from './components/HistoryPanel';
import CropForm from './components/CropForm';
import PredictionPanel from './components/PredictionPanel';
import './App.css';

function App() {
    return (
        <div className="app">
            <HistoryPanel />
            <div className="main-content">
                <div className="prediction-card">
                    <CropForm />
                    <PredictionPanel />
                </div>
            </div>
        </div>
    );
}

export default App;
