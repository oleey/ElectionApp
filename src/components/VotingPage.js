import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';

const VotingPage = () => {
    const [candidates, setCandidates] = useState([]);
    const [selectedVotes, setSelectedVotes] = useState({});
    const [message, setMessage] = useState('');
    const history = useHistory();

    useEffect(() => {
        const voter = JSON.parse(sessionStorage.getItem('voter'));
        if (!voter) {
            history.push('/login');
            return;
        }

        const fetchCandidates = async () => {
            const candidatesSnapshot = await getDocs(collection(db, 'candidates'));
            const candidatesList = candidatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCandidates(candidatesList);
        };

        fetchCandidates();
    }, [history]);

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
            {candidates.reduce((positions, candidate) => {
                if (!positions[candidate.position]) positions[candidate.position] = [];
                positions[candidate.position].push(candidate);
                return positions;
            }, {})}

            {Object.entries(candidates.reduce((positions, candidate) => {
                if (!positions[candidate.position]) positions[candidate.position] = [];
                positions[candidate.position].push(candidate);
                return positions;
            }, {})).map(([position, candidates]) => (
                <div key={position}>
                    <h3>{position}</h3>
                    {candidates.map(candidate => (
                        <div key={candidate.id}>
                            <input
                                type="radio"
                                name={position}
                                value={candidate.id}
                                onChange={() => handleVoteChange(position, candidate.id)}
                            />
                            <label>{candidate.name}</label>
                        </div>
                    ))}
                </div>
            ))}
            <button onClick={handleSubmitVotes}>Submit Votes</button>
            <p>{message}</p>
        </div>
    );
};

export default VotingPage;
