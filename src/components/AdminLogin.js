import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const adminLogin = (event) => {
        event.preventDefault();

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                setMessage('Admin logged in successfully!');
                //navigate('/upload-candidate');
                navigate('/admin-dashboard')
            })
            .catch((error) => {
                setMessage('Error logging in: ' + error.message);
            });
    };

    return (
        <div className="container">
            <h1>Admin Login</h1>
            <form onSubmit={adminLogin}>
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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

export default AdminLogin;
