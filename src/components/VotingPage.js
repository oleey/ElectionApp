import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc, query, where, updateDoc } from 'firebase/firestore'; // Added updateDoc
import { useNavigate } from 'react-router-dom'; // Replaced useHistory with useNavigate

const VotingPage = () => {
    const [candidates, setCandidates] = useState([]);
    const [selectedVotes, setSelectedVotes] = useState({});
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const voter = JSON.parse(sessionStorage.getItem('voter'));
        if (!voter) {
            navigate('/voter-login');
            return;
        }

        const fetchCandidates = async () => {
            const candidatesSnapshot = await getDocs(collection(db, 'candidates'));
            const candidatesList = candidatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCandidates(candidatesList);
        };

        fetchCandidates();

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
    }, [navigate]);

    const handleVoteChange = (position, candidateId) => {
        setSelectedVotes(prevVotes => ({ ...prevVotes, [position]: candidateId }));
    };

    

    const handleSubmitVotes = async () => {
        const voter = JSON.parse(sessionStorage.getItem('voter'));
        if (!voter) {
            setMessage('You are not logged in');
            return;
        }

        try {
            for (const [position, candidateId] of Object.entries(selectedVotes)) {
                await addDoc(collection(db, 'votes'), {
                    voterRegNumber: voter.regNumber,
                    candidateId,
                    position,
                });
            }

            const voterDoc = query(collection(db, 'voters'), where('regNumber', '==', voter.regNumber));
            const voterSnapshot = await getDocs(voterDoc);
            const voterRef = voterSnapshot.docs[0].ref;

            await updateDoc(voterRef, { hasVoted: true });

            setMessage('Votes submitted successfully!');
        } catch (error) {
            setMessage('Error submitting votes: ' + error.message);
        }
    };

    return (
        <div className="container">
            <h1>Vote for Candidates</h1>
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
            <button onClick={handleSubmitVotes}>Submit Votes</button>
            <p>{message}</p>
        </div>
    );
};

export default VotingPage;
