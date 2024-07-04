import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterVoter from './components/RegisterVoter';
import AdminLogin from './components/AdminLogin';
import UploadCandidate from './components/UploadCandidate';
import AdminDashboard from './components/AdminDashboard';
import VotingPage from './components/VotingPage';
import VoterLogin from './components/VoterLogin';
import ResultsPage from './components/ResultsPage';
import VoterListPage from './components/VoterListPage';


import './App.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AdminLogin/>} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/vote" element={<VotingPage />} />
                <Route path="/allvoters" element={<VoterListPage />} />

                <Route path="/results" element={<ResultsPage />} />

                <Route path="/voter-login" element={<VoterLogin />} />

                <Route path="/register-voter" element={<RegisterVoter />} />
                <Route path="/upload-candidate" element={<UploadCandidate />} />
            </Routes>
        </Router>
    );
};

export default App;
