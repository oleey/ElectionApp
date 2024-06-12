import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const RegisterVoter = () => {
    const [regNo, setRegNo] = useState('');
    const [name, setName] = useState('');
    const [unit, setUnit] = useState('');
    const [level, setLevel] = useState('');
    const [message, setMessage] = useState('');

    const registerVoter = async (event) => {
        event.preventDefault();

        try {
            await addDoc(collection(db, 'voters'), {
                name: name,
                regNo: regNo,
                unit: unit,
                level: level
            });
            setMessage('Voters accredited successfully!');
        } catch (error) {
            setMessage('Error accrediting voters: ' + error.message);
        }
    };

    return (
        <div className="container">
            <h1>Accredit Students</h1>
            <form onSubmit={registerVoter}>
                <label>
                    Registration Number:
                    <input type="text" value={regNo} onChange={(e) => setRegNo(e.target.value)} required />
                </label>
                <label>
                    Full Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <label>
                    Unit:
                    <select value={unit} onChange={(e) => setUnit(e.target.value)} required>
                        <option value="">Select Unit</option>
                        <option value="Political Science Edu">Political Science Edu</option>
                        <option value="Social Studies">Social Studies</option>
                        <option value="Economics Edu">Economics Edu</option>
                        <option value="Geography Edu">Geography Edu</option>
                    </select>
                </label>
                <label>
                    Level:
                    <select value={level} onChange={(e) => setLevel(e.target.value)} required>
                        <option value="">Select Level</option>
                        <option value="100L">100L</option>
                        <option value="200L">200L</option>
                        <option value="300L">300L</option>
                        <option value="400L">400L</option>
                    </select>
                </label>

                <button type="submit">Register</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default RegisterVoter;
