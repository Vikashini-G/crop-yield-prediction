import React from 'react';
import './PredictionPanel.css';

function PredictionPanel({ prediction }) {
  console.log('Prediction received in PredictionPanel:', prediction);
  return (
    <div className="PredictionPanel">
      <h2>Estimated crop yield:</h2>
      <h1>{prediction !== null ? prediction.toFixed(2)+' tons' : 'N/A'}</h1>
    </div>
  );
}

export default PredictionPanel;
