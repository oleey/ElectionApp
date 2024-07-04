import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, updateDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import './VotingPage.css';

const VotingPage = () => {
    const [candidates, setCandidates] = useState([]);
    const [selectedVotes, setSelectedVotes] = useState({});
    const voterId = localStorage.getItem('voterId');

    useEffect(() => {
        const fetchCandidates = async () => {
            const candidatesRef = collection(db, 'candidates');
            const candidatesSnapshot = await getDocs(candidatesRef);
            const candidatesList = candidatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCandidates(candidatesList);
        };

        fetchCandidates();
    }, []);

    const handleVoteChange = (position, candidateId) => {
        setSelectedVotes(prevVotes => ({ ...prevVotes, [position]: candidateId }));
    };

    const handleSubmitVote = async () => {
        if (!voterId) {
            alert('No voter ID found. Please log in again.');
            return;
        }

        try {
            const voterRef = doc(db, 'voters', voterId);
            const voterDoc = await getDoc(voterRef);

            if (!voterDoc.exists) {
                alert('Voter does not exist.');
                return;
            }

            const voterData = voterDoc.data();

            if (voterData.hasVoted) {
                alert('You have already voted.');
                return;
            }

            for (const position in selectedVotes) {
                const candidateId = selectedVotes[position];
                const voteRef = doc(db, 'votes', position);
                const voteDoc = await getDoc(voteRef);

                if (voteDoc.exists) {
                    const voteData = voteDoc.data();
                    if (voteData[candidateId]) {
                        voteData[candidateId]++;
                    } else {
                        voteData[candidateId] = 1;
                    }
                    await updateDoc(voteRef, voteData);
                } else {
                    await setDoc(voteRef, { [candidateId]: 1 });
                }
            }

            await updateDoc(voterRef, { hasVoted: true });

            alert('Your vote has been recorded. Thank you!');
        } catch (error) {
            console.error('Error submitting vote:', error);
            alert('An error occurred while submitting your vote. Please try again.');
        }
    };

    return (
        <div className="voting-page-container">
            <h1>Vote for Your Candidates</h1>
            {candidates.length > 0 ? (
                <>
                    <h2>Presidential Candidates</h2>
                    {candidates.filter(candidate => candidate.position === 'President').map(candidate => (
                        <div key={candidate.id} className="candidate">
                            <img className='candidate-image' src={candidate.pictureURL} alt={candidate.name} />
                            <p>{candidate.name}</p>
                            <p>{candidate.unit}</p>
                            <p>{candidate.level}</p>
                            <input
                                type="radio"
                                name="President"
                                value={candidate.id}
                                onChange={() => handleVoteChange('President', candidate.id)}
                            />
                        </div>
                    ))}
                    <h2>Vice Presidential Candidates</h2>
                    {candidates.filter(candidate => candidate.position === 'Vice President').map(candidate => (
                        <div key={candidate.id} className="candidate">
                             <img className='candidate-image' src={candidate.pictureURL} alt={candidate.name} />

                            <p>{candidate.name}</p>
                            <p>{candidate.unit}</p>
                            <p>{candidate.level}</p>
                            <input
                                type="radio"
                                name="Vice President"
                                value={candidate.id}
                                onChange={() => handleVoteChange('Vice President', candidate.id)}
                            />
                        </div>
                    ))}
                    <h2>Welfare Officer Candidates</h2>
                    {candidates.filter(candidate => candidate.position === 'Welfare Officer').map(candidate => (
                        <div key={candidate.id} className="candidate">
                                                        <img className='candidate-image' src={candidate.pictureURL} alt={candidate.name} />

                            <p>{candidate.name}</p>
                            <p>{candidate.unit}</p>
                            <p>{candidate.level}</p>
                            <input
                                type="radio"
                                name="Welfare Officer"
                                value={candidate.id}
                                onChange={() => handleVoteChange('Welfare Officer', candidate.id)}
                            />
                        </div>
                    ))}

<h2>General Secretary Candidates</h2>
                    {candidates.filter(candidate => candidate.position === 'General Secretary').map(candidate => (
                        <div key={candidate.id} className="candidate">
                                                        <img className='candidate-image' src={candidate.pictureURL} alt={candidate.name} />

                            <p>{candidate.name}</p>
                            <p>{candidate.unit}</p>
                            <p>{candidate.level}</p>
                            <input
                                type="radio"
                                name="General Secretary"
                                value={candidate.id}
                                onChange={() => handleVoteChange('General Secretary', candidate.id)}
                            />
                        </div>
                    ))}

<h2>Assistant General Secretary Candidates</h2>
                    {candidates.filter(candidate => candidate.position === 'Assistant General Secretary').map(candidate => (
                        <div key={candidate.id} className="candidate">
                                                        <img className='candidate-image' src={candidate.pictureURL} alt={candidate.name} />

                            <p>{candidate.name}</p>
                            <p>{candidate.unit}</p>
                            <p>{candidate.level}</p>
                            <input
                                type="radio"
                                name="Assistant General Secretary"
                                value={candidate.id}
                                onChange={() => handleVoteChange('Assistant General Secretary', candidate.id)}
                            />
                        </div>
                    ))}

<h2>Financial Secretary Candidates</h2>
                    {candidates.filter(candidate => candidate.position === 'Financial Secretary').map(candidate => (
                        <div key={candidate.id} className="candidate">
                                                        <img className='candidate-image' src={candidate.pictureURL} alt={candidate.name} />

                            <p>{candidate.name}</p>
                            <p>{candidate.unit}</p>
                            <p>{candidate.level}</p>
                            <input
                                type="radio"
                                name="Financial Secretary"
                                value={candidate.id}
                                onChange={() => handleVoteChange('Financial Secretary', candidate.id)}
                            />
                        </div>
                    ))}

<h2>Treasurer Candidates</h2>
                    {candidates.filter(candidate => candidate.position === 'Treasurer').map(candidate => (
                        <div key={candidate.id} className="candidate">
                                                        <img className='candidate-image' src={candidate.pictureURL} alt={candidate.name} />

                            <p>{candidate.name}</p>
                            <p>{candidate.unit}</p>
                            <p>{candidate.level}</p>
                            <input
                                type="radio"
                                name="Treasurer"
                                value={candidate.id}
                                onChange={() => handleVoteChange('Treasurer', candidate.id)}
                            />
                        </div>
                    ))}
                    <h2>Director of Social Candidates</h2>
                    {candidates.filter(candidate => candidate.position === 'Director of Social').map(candidate => (
                        <div key={candidate.id} className="candidate">
                                                        <img className='candidate-image' src={candidate.pictureURL} alt={candidate.name} />

                            <p>{candidate.name}</p>
                            <p>{candidate.unit}</p>
                            <p>{candidate.level}</p>
                            <input
                                type="radio"
                                name="Director of Social"
                                value={candidate.id}
                                onChange={() => handleVoteChange('Director of Social', candidate.id)}
                            />
                        </div>
                    ))}

<h2>Director of Games Candidates</h2>
                    {candidates.filter(candidate => candidate.position === 'Director of Games').map(candidate => (
                        <div key={candidate.id} className="candidate">
                                                        <img className='candidate-image' src={candidate.pictureURL} alt={candidate.name} />

                            <p>{candidate.name}</p>
                            <p>{candidate.unit}</p>
                            <p>{candidate.level}</p>
                            <input
                                type="radio"
                                name="Director of Games"
                                value={candidate.id}
                                onChange={() => handleVoteChange('Director of Games', candidate.id)}
                            />
                        </div>
                    ))}

<h2>Public Relation Officer Candidates</h2>
                    {candidates.filter(candidate => candidate.position === 'Public Relation Officer').map(candidate => (
                        <div key={candidate.id} className="candidate">
                                                        <img className='candidate-image' src={candidate.pictureURL} alt={candidate.name} />

                            <p>{candidate.name}</p>
                            <p>{candidate.unit}</p>
                            <p>{candidate.level}</p>
                            <input
                                type="radio"
                                name="Public Relation Officer"
                                value={candidate.id}
                                onChange={() => handleVoteChange('Public Relation Officer', candidate.id)}
                            />
                        </div>
                    ))}

<h2>Director of Environment Candidates</h2>
                    {candidates.filter(candidate => candidate.position === 'Director of Environment').map(candidate => (
                        <div key={candidate.id} className="candidate">
                                                        <img className='candidate-image' src={candidate.pictureURL} alt={candidate.name} />

                            <p>{candidate.name}</p>
                            <p>{candidate.unit}</p>
                            <p>{candidate.level}</p>
                            <input
                                type="radio"
                                name="Director of Environment"
                                value={candidate.id}
                                onChange={() => handleVoteChange('Director of Environment', candidate.id)}
                            />
                        </div>
                    ))}

<h2>Director of Transport Candidates</h2>
                    {candidates.filter(candidate => candidate.position === 'Director of Transport').map(candidate => (
                        <div key={candidate.id} className="candidate">
                                                        <img className='candidate-image' src={candidate.pictureURL} alt={candidate.name} />

                            <p>{candidate.name}</p>
                            <p>{candidate.unit}</p>
                            <p>{candidate.level}</p>
                            <input
                                type="radio"
                                name="Director of Transport"
                                value={candidate.id}
                                onChange={() => handleVoteChange('Director of Transport', candidate.id)}
                            />
                        </div>
                    ))}

<h2>Provost Candidates</h2>
                    {candidates.filter(candidate => candidate.position === 'Provost').map(candidate => (
                        <div key={candidate.id} className="candidate">
                                                        <img className='candidate-image' src={candidate.pictureURL} alt={candidate.name} />

                            <p>{candidate.name}</p>
                            <p>{candidate.unit}</p>
                            <p>{candidate.level}</p>
                            <input
                                type="radio"
                                name="Provost"
                                value={candidate.id}
                                onChange={() => handleVoteChange('Provost', candidate.id)}
                            />
                        </div>
                    ))}

                </>
            ) : (
                <p>Loading candidates...</p>
            )}
            <button onClick={handleSubmitVote}>Submit Vote</button>
        </div>
    );
};

export default VotingPage;
