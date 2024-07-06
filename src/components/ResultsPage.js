import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDoc, doc , getDocs} from 'firebase/firestore';
import './ResultPage.css';


const ResultsPage = () => {
    const [results, setResults] = useState({});
    const [candidates, setCandidates] = useState({});
    const positions = ['President', 'Vice President', 'Welfare Director', 'Assistant General Secretary', 'Director of Games', 'Director of Social', 'Financial Secretary', 'General Secretary', 'Provost', 'Public Relation Officer', 'Treasurer'];

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const resultsData = {};
                for (const position of positions) {
                    // Fetch the document for each position
                    const positionRef = doc(db, 'votes', position);  
                    const positionDoc = await getDoc(positionRef);

                    if (positionDoc.exists()) {
                        const positionResults = positionDoc.data();

                        // Fetch candidate names
                        const candidateResults = await Promise.all(
                            Object.entries(positionResults).map(async ([candidateId, votes]) => {
                                const candidateRef = doc(db, 'candidates', candidateId);
                                const candidateDoc = await getDoc(candidateRef);
                                const candidateData = candidateDoc.data();
                                return { id: candidateId, name: candidateData?.name || 'Unknown', votes };
                            })
                        );

                        resultsData[position] = candidateResults.sort((a, b) => b.votes - a.votes); // Sort by votes in descending order
                    } else {
                        resultsData[position] = [];
                    }
                }
                setResults(resultsData);
            } catch (error) {
                console.error('Error fetching results:', error);
            }
        };

        const fetchCandidates = async () => {
            try {
                const candidatesRef = collection(db, 'candidates');
                const candidatesSnapshot = await getDocs(candidatesRef);

                const candidatesData = {};
                candidatesSnapshot.forEach((doc) => {
                    candidatesData[doc.id] = doc.data();
                });

                setCandidates(candidatesData);
            } catch (error) {
                console.error('Error fetching candidates:', error);
            }
        };

        fetchResults();
        fetchCandidates();
    }, []);

    return (
        <div className="results-page-container">
            <h1>Election Results</h1>
            {positions.map(position => (
                <div key={position} className="results-section">
                    <h2>{position}</h2>
                    {results[position] ? (
                        results[position].map(({ id, name, votes }) => (
                            <div key={id} className="result-item">
                                <p>Candidate Name: {name}</p>
                                <p>Votes: {votes}</p>
                            </div>
                        ))
                    ) : (
                        <p>Loading results for {position}...</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ResultsPage;
