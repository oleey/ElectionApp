import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';

const VotingPage = () => {
    const [regNo, setRegNo] = useState('');
    const [password, setPassword] = useState('');
    const [positions, setPositions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState('');
    const [message, setMessage] = useState('');
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const positionsRef = collection(db, 'positions');
                const positionsSnapshot = await getDocs(positionsRef);
                const positionsList = positionsSnapshot.docs.map(doc => doc.data().name);
                setPositions(positionsList);
            } catch (error) {
                setMessage('Error fetching positions: ' + error.message);
            }
        };
        fetchPositions();
    }, []);

    const checkVoterStatus = async () => {
        setMessage('');
        const votersRef = collection(db, 'voters');
        const q = query(votersRef, where('regNo', '==', regNo), where('password', '==', password));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            setMessage('Invalid registration number or password.');
        } else {
            const votesRef = collection(db, 'votes');
            const voteQuery = query(votesRef, where('regNo', '==', regNo), where('position', '==', selectedPosition));
            const voteSnapshot = await getDocs(voteQuery);

            if (!voteSnapshot.empty) {
                setHasVoted(true);
                setMessage('You have already voted for this position.');
            } else {
                setHasVoted(false);
                fetchCandidates(selectedPosition);
            }
        }
    };

    const fetchCandidates = async (position) => {
        try {
            const candidatesRef = collection(db, 'candidates');
            const candidatesQuery = query(candidatesRef, where('position', '==', position));
            const candidatesSnapshot = await getDocs(candidatesQuery);
            const candidatesList = candidatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCandidates(candidatesList);
        } catch (error) {
            setMessage('Error fetching candidates: ' + error.message);
        }
    };

    const castVote = async () => {
        if (!selectedCandidate) {
            setMessage('Please select a candidate to vote for.');
            return;
        }

        try {
            await addDoc(collection(db, 'votes'), {
                regNo,
                position: selectedPosition,
                candidateId: selectedCandidate,
                timestamp: new Date()
            });
            setMessage('Vote cast successfully!');
            setHasVoted(true);
        } catch (error) {
            setMessage('Error casting vote: ' + error.message);
        }
    };

    return (
        <div className="container">
            <h1>Student Voting</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                checkVoterStatus();
            }}>
                <label>
                    Registration Number:
                    <input type="text" value={regNo} onChange={(e) => setRegNo(e.target.value)} required />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <label>
                    Position:
                    <select value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)} required>
                        <option value="">Select Position</option>
                        {positions.map((position, index) => (
                            <option key={index} value={position}>{position}</option>
                        ))}
                    </select>
                </label>
                <button type="submit">Check Voting Status</button>
            </form>
            {hasVoted ? (
                <p>{message}</p>
            ) : (
                candidates.length > 0 && (
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        castVote();
                    }}>
                        <h2>Select a Candidate to Vote For</h2>
                        {candidates.map(candidate => (
                            <label key={candidate.id}>
                                <input
                                    type="radio"
                                    value={candidate.id}
                                    checked={selectedCandidate === candidate.id}
                                    onChange={(e) => setSelectedCandidate(e.target.value)}
                                />
                                {candidate.name}
                            </label>
                        ))}
                        <button type="submit">Vote</button>
                    </form>
                )
            )}
            <p>{message}</p>
        </div>
    );
};

export default VotingPage;

