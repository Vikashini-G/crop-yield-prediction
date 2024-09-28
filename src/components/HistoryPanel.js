import React, { useEffect, useState } from 'react';
import './HistoryPanel.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const HistoryPanel = () => {
    const [history, setHistory] = useState([]);

    const fetchHistory = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'crops'));
            const historyData = [];
            querySnapshot.forEach((doc) => {
                historyData.push({ id: doc.id, ...doc.data() });
            });
            setHistory(historyData);
        } catch (error) {
            console.error('Error fetching history: ', error);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <div className="history-panel">
            <h1>History</h1>
            <table className='history-table'>
                <tbody>
                    {history.length > 0 ? (
                        history.map((item) => (
                            <React.Fragment key={item.id}>
                                <tr>
                                    <td><strong>State name</strong></td>
                                    <td>{item.State_Name}</td>
                                </tr>
                                <tr>
                                    <td><strong>Crop type</strong></td>
                                    <td>{item.Crop_Type}</td>
                                </tr>
                                <tr>
                                    <td id="bolder">Crop</td>
                                    <td id="bolder">{item.Crop}</td>
                                </tr>
                                
                                <tr style={{ height: '10px' }}/>

                                <tr>
                                    <td><strong>Rainfall</strong></td>
                                    <td>{parseFloat(item.rainfall).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td><strong>Temperature</strong></td>
                                    <td>{parseFloat(item.temperature).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td><strong>Area (ha)</strong></td>
                                    <td>{parseFloat(item.Area_in_hectares).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td id="bolder">Prediction</td>
                                    <td id="bolder">{parseFloat(item.prediction).toFixed(2)} tons</td>
                                </tr>
                                <tr>
                                    <td colSpan="2"><hr style={{borderTop: '1px solid #2d5502', opacity: 0.5}}/></td>
                                </tr>
                            </React.Fragment>
                        ))
                    ) : (
                        <li>No predictions found.</li>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default HistoryPanel;
