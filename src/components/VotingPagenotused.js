import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';

const VotingPage = () => {
    const [regNo, setRegNo] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [message, setMessage] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [voted, setVoted] = useState(false);

    const handleRegNoChange = (e) => {
        setRegNo(e.target.value);
    };

    const checkRegistration = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const q = query(collection(db, 'voters'), where('regNo', '==', regNo));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setMessage('You cannot vote.');
                setIsRegistered(false);
            } else {
                setIsRegistered(true);
                setMessage('');
                fetchCandidates();
            }
        } catch (error) {
            setMessage('Error checking registration: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCandidates = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'candidates'));
            const candidatesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCandidates(candidatesList);
        } catch (error) {
            setMessage('Error fetching candidates: ' + error.message);
        }
    };

    const voteForCandidate = async (candidateId) => {
        try {
            const userDoc = doc(db, 'voters', regNo);
            await updateDoc(userDoc, {
                votedFor: candidateId
            });
            setMessage('Your vote has been recorded!');
            setVoted(true);
        } catch (error) {
            setMessage('Error voting for candidate: ' + error.message);
        }
    };

    return (
        <div className="container">
            <h1>Vote for Your Candidate</h1>
            {isRegistered ? (
                voted ? (
                    <p>{message}</p>
                ) : (
                    <>
                        <h2>Candidates List</h2>
                        <ul>
                            {candidates.map(candidate => (
                                <li key={candidate.id}>
                                    <p>Name: {candidate.name}</p>
                                    <p>Unit: {candidate.unit}</p>
                                    <p>Level: {candidate.level}</p>
                                    <p>Email Address: {candidate.email}</p>
                                    <p>Position:{candidate.position}</p>
                                    <img src={candidate.pictureURL} alt={candidate.name} width="100" />
                                    <button onClick={() => voteForCandidate(candidate.id)}>Vote</button>
                                </li>
                            ))}
                        </ul>
                        <p>{message}</p>
                    </>
                )
            ) : (
                <form onSubmit={checkRegistration}>
                    <label>
                        Registration Number:
                        <input type="text" value={regNo} onChange={handleRegNoChange} required />
                    </label>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Checking...' : 'Check Registration'}
                    </button>
                    <p>{message}</p>
                </form>
            )}
        </div>
    );
};

export default VotingPage;
