/*import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, updateDoc, doc, increment } from 'firebase/firestore';

const VotingPage = () => {
    const [candidates, setCandidates] = useState([]);
    const [selectedVotes, setSelectedVotes] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const candidatesSnapshot = await getDocs(collection(db, 'candidates'));
                const candidatesList = candidatesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCandidates(candidatesList);
            } catch (error) {
                setMessage('Error fetching candidates: ' + error.message);
            }
        };

        fetchCandidates();
    }, []);

    const handleVoteChange = (candidateId) => {
        setSelectedVotes(prevVotes => ({
            ...prevVotes,
            [candidateId]: (prevVotes[candidateId] || 0) + 1
        }));
    };

    const handleVoteSubmit = async (event) => {
        event.preventDefault();
        setMessage('');

        try {
            const voter = JSON.parse(sessionStorage.getItem('voter'));
            if (!voter) {
                setMessage('You must be logged in to vote.');
                return;
            }

            const voterRef = doc(db, 'voters', voter.id);
            await updateDoc(voterRef, { votes: selectedVotes });

            setMessage('Your vote has been successfully submitted!');
        } catch (error) {
            setMessage('Error submitting your vote: ' + error.message);
        }
    };

    return (
        <div className="container">
            <h1>Vote for Candidates</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleVoteSubmit}>
                {candidates.map(candidate => (
                    <div key={candidate.id}>
                        <h3>{candidate.name}</h3>
                        <p>Position: {candidate.position}</p>
                        <p>Email: {candidate.email}</p>
                        <p>Unit: {candidate.unit}</p>
                        <p>Level: {candidate.level}</p>
                        <button
                            type="button"
                            onClick={() => handleVoteChange(candidate.id)}
                        >
                            Vote for {candidate.name}
                        </button>
                    </div>
                ))}
                <button type="submit">Submit Vote</button>
            </form>
        </div>
    );
};

export default VotingPage;
*/
import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import styles from './VotingPage.module.css';

const VotingPage = ({ voterId }) => {
    const [candidates, setCandidates] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'candidates'));
                const candidatesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCandidates(candidatesList);
            } catch (error) {
                setMessage('Error fetching candidates: ' + error.message);
            }
        };

        fetchCandidates();
    }, []);

    const handleVote = async (candidateId, position) => {
        try {
            const voterDocRef = doc(db, 'voters', voterId);
            const voterDoc = await getDoc(voterDocRef);
            if (voterDoc.exists()) {
                const voterData = voterDoc.data();
                if (voterData.votes[position]) {
                    setMessage('You have already voted for this position.');
                    return;
                }

                const candidateDocRef = doc(db, 'candidates', candidateId);
                await updateDoc(candidateDocRef, {
                    votesCount: increment(1)
                });

                const updatedVotes = { ...voterData.votes, [position]: candidateId };
                await updateDoc(voterDocRef, { votes: updatedVotes });

                setMessage('Vote recorded successfully!');
            } else {
                setMessage('Voter not found.');
            }
        } catch (error) {
            setMessage('Error recording vote: ' + error.message);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Voting Page</h1>
            <p>{message}</p>
            <div className={styles.candidatesList}>
                {candidates.map(candidate => (
                    <div key={candidate.id} className={styles.candidate}>
                        <img src={candidate.pictureURL} alt={candidate.name} className={styles.candidatePicture} />
                        <div className={styles.candidateDetails}>
                            <h3>{candidate.name}</h3>
                            <p>{candidate.position}</p>
                            <button onClick={() => handleVote(candidate.id, candidate.position)}>
                                Vote for {candidate.name}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VotingPage;


