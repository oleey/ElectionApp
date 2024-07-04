import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const VoterLogin = () => {
    const [regNo, setRegNo] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setMessage('');

        try {
            const votersRef = collection(db, 'voters');
            const q = query(votersRef, where('regNo', '==', regNo));
            const querySnapshot = await getDocs(q);
           // await updateDoc(q, { password: "true" });
          // await updateDoc(votersRef, { password: "true"});



            if (querySnapshot.empty) {
                setMessage('Voter does not exist.');
                return;
            }

            const voterDoc = querySnapshot.docs[0];
            const voterData = voterDoc.data();

            if (voterData.password !== password) {
                setMessage('Incorrect password.');
                return;
            }

            if (voterData.hasVoted) {
                setMessage('You have already voted.');
                return;
            }


            localStorage.setItem('voterId', voterDoc.id);
            console.log('localStorage', localStorage.getItem('voterId'));

            navigate('/vote');
        } catch (error) {
            console.error('Error logging in:', error);
            setMessage('An error occurred during login. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <h1>Voter Login</h1>
            <form onSubmit={handleLogin}>
                <label>
                    Registration Number:
                    <input
                        type="text"
                        value={regNo}
                        onChange={(e) => setRegNo(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default VoterLogin;
