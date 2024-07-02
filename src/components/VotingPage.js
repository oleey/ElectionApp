import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import './VotingPage.css';

const VotingPage = ({ location }) => {
    const { state: { voter } } = location;
    const [candidates, setCandidates] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchCandidates = async () => {
            const q = query(collection(db, 'candidates'));
            const querySnapshot = await getDocs(q);
            const candidatesByPosition = {};

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (!candidatesByPosition[data.position]) {
                    candidatesByPosition[data.position] = [];
                }
                candidatesByPosition[data.position].push({ id: doc.id, ...data });
            });

            setCandidates(candidatesByPosition);
        };

        fetchCandidates();
    }, []);

    const handleVote = async (position, candidateId) => {
        if (voter.hasVoted && voter.hasVoted[position]) {
            setMessage(`You have already voted for ${position}`);
            return;
        }

        try {
            const candidateRef = doc(db, 'candidates', candidateId);
            await updateDoc(candidateRef, {
                votes: (candidates[position].find(c => c.id === candidateId).votes || 0) + 1
            });

            const voterRef = doc(db, 'voters', voter.id);
            await updateDoc(voterRef, {
                hasVoted: { ...voter.hasVoted, [position]: true }
            });

            setMessage(`Successfully voted for ${candidates[position].find(c => c.id === candidateId).name}`);
            setCandidates({
                ...candidates,
                [position]: candidates[position].map(candidate =>
                    candidate.id === candidateId ? { ...candidate, votes: candidate.votes + 1 } : candidate
                )
            });
        } catch (error) {
            setMessage('Error voting: ' + error.message);
        }
    };

    return (
        <div className="voting-container">
            <h1>Vote for Your Candidates</h1>
            {Object.keys(candidates).map(position => (
                <div key={position} className="position-section">
                    <h2>{position}</h2>
                    <div className="candidates-list">
                        {candidates[position].map(candidate => (
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
                                    disabled={voter.hasVoted && voter.hasVoted[position]}
                                >
                                    {voter.hasVoted && voter.hasVoted[position] ? 'Voted' : 'Vote'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <p>{message}</p>
        </div>
    );
};

export default VotingPage;
