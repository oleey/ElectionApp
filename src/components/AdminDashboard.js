import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const goToRegisterVoter = () => {
        navigate('/register-voter');
    };

    const goToUploadCandidate = () => {
        navigate('/upload-candidate');
    };

    return (
        <div className="container">
            <h1>Admin Dashboard</h1>
            <div className="buttons">
                <button onClick={goToRegisterVoter}>Register Voter</button>
                <button onClick={goToUploadCandidate}>Upload Candidate</button>
            </div>
        </div>
    );
};

export default AdminDashboard;
