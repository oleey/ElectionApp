import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import './VotingPage.css'; // Import specific CSS for the VotingPage

const VotingPage = ({ voter }) => {
    const [positions, setPositions] = useState([]);
    const [candidates, setCandidates] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch all positions
        const fetchPositions = async () => {
            const q = query(collection(db, 'positions'));
            const querySnapshot = await getDocs(q);
            const fetchedPositions = querySnapshot.docs.map(doc => doc.data().positionName);
            setPositions(fetchedPositions);
        };

        fetchPositions();
    }, []);

    useEffect(() => {
        const fetchCandidates = async () => {
            const candidatesByPosition = {};

            for (const position of positions) {
                const q = query(collection(db, 'candidates'), where('position', '==', position));
                const querySnapshot = await getDocs(q);
                candidatesByPosition[position] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            }

            setCandidates(candidatesByPosition);
        };

        if (positions.length > 0) {
            fetchCandidates();
        }
    }, [positions]);

    const handleVote = async (position, candidateId) => {
        if (voter.hasVoted[position]) {
            setMessage(`You have already voted for ${position}`);
            return;
        }

        try {
            // Increment the candidate's votes
            const candidateRef = doc(db, 'candidates', candidateId);
            await updateDoc(candidateRef, {
                votes: (candidates[position].find(c => c.id === candidateId).votes || 0) + 1
            });

            // Mark voter as having voted for this position
            const voterRef = doc(db, 'voters', voter.id);
            await updateDoc(voterRef, {
                [`hasVoted.${position}`]: true
            });

            setMessage(`Successfully voted for ${candidates[position].find(c => c.id === candidateId).name}`);
            voter.hasVoted[position] = true;
        } catch (error) {
            setMessage('Error voting: ' + error.message);
        }
    };

    return (
        <div className="voting-container">
            <h1>Vote for Your Candidates</h1>
            {positions.map((position) => (
                <div key={position} className="position-section">
                    <h2>{position}</h2>
                    <div className="candidates-list">
                        {candidates[position] ? (
                            candidates[position].map((candidate) => (
                                <div key={candidate.id} className="candidate-card">
                                    <img src={candidate.pictureURL} alt={candidate.name} className="candidate-image" />
                                    <div className="candidate-details">
                                        <h3>{candidate.name}</h3>
                                        <p><strong>Unit:</strong> {candidate.unit}</p>
                                        <p><strong>Level:</strong> {candidate.level}</p>
                                        <p><strong>Position:</strong> {candidate.position}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleVote(position, candidate.id)}
                                        disabled={voter.hasVoted[position]}
                                    >
                                        {voter.hasVoted[position] ? 'Voted' : 'Vote'}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No candidates available for this position.</p>
                        )}
                    </div>
                </div>
            ))}
            <p>{message}</p>
        </div>
    );
};

export default VotingPage;
