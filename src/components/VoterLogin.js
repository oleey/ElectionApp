import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const VoterLogin = () => {
    const [regNo, setRegNumber] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setMessage('');

        try {
            const q = query(collection(db, 'voters'), where('regNo', '==', regNo), where('password', '==', password));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setMessage('Invalid registration number or password');
                return;
            }

            const voterData = querySnapshot.docs[0].data();
            if (voterData.hasVoted) {
                setMessage('You have already voted.');
                return;
            }

            // Store voter info in session storage and navigate to the voting page
            sessionStorage.setItem('voter', JSON.stringify({ regNo }));
            navigate('/vote');
        } catch (error) {
            setMessage('Error logging in: ' + error.message);
        }
    };

    return (
        <div className="container">
            <h1>Voter Login</h1>
            <form onSubmit={handleLogin}>
                <label>
                    Registration Number:
                    <input type="text" value={regNo} onChange={(e) => setRegNumber(e.target.value)} required />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default VoterLogin;
