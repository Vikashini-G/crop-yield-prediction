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
                                    <td><strong>Crop Type</strong></td>
                                    <td>{item.cropType}</td>
                                </tr>
                                <tr>
                                    <td><strong>Region</strong></td>
                                    <td>{item.region}</td>
                                </tr>
                                <tr>
                                    <td><strong>Season</strong></td>
                                    <td>{item.season}</td>
                                </tr>
                                <tr>
                                    <td colSpan="2"><hr /></td>
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
