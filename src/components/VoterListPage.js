import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import './VoterListPage.css';

const VoterListPage = () => {
    const [voters, setVoters] = useState([]);
    const [filteredVoters, setFilteredVoters] = useState([]);
    const [levels, setLevels] = useState([]);
    const [units, setUnits] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');

    useEffect(() => {
        const fetchVoters = async () => {
            try {
                const votersRef = collection(db, 'voters');
                const votersSnapshot = await getDocs(votersRef);
                const allVoters = votersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setVoters(allVoters);

                // Extract unique levels and units
                const uniqueLevels = [...new Set(allVoters.map(voter => voter.level))];
                const uniqueUnits = [...new Set(allVoters.map(voter => voter.unit))];

                setLevels(uniqueLevels);
                setUnits(uniqueUnits);

                setFilteredVoters(allVoters);
            } catch (error) {
                console.error('Error fetching voters:', error);
            }
        };

        fetchVoters();
    }, []);

    useEffect(() => {
        const filterVoters = () => {
            let filtered = voters;

            if (selectedLevel) {
                filtered = filtered.filter(voter => voter.level === selectedLevel);
            }

            if (selectedUnit) {
                filtered = filtered.filter(voter => voter.unit === selectedUnit);
            }

            setFilteredVoters(filtered);
        };

        filterVoters();
    }, [selectedLevel, selectedUnit, voters]);

    return (
        <div className="voter-list-container">
            <h1>Registered Voters</h1>
            <div className="filters">
                <div className="filter-item">
                    <label htmlFor="level">Filter by Level:</label>
                    <select
                        id="level"
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                    >
                        <option value="">All Levels</option>
                        {levels.map(level => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-item">
                    <label htmlFor="unit">Filter by Unit:</label>
                    <select
                        id="unit"
                        value={selectedUnit}
                        onChange={(e) => setSelectedUnit(e.target.value)}
                    >
                        <option value="">All Units</option>
                        {units.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                </div>
            </div>
            <table className="voter-list-table">
                <thead>
                    <tr>
                        <th>Registration Number</th>
                        <th>Level</th>
                        <th>Unit</th>
                        <th>Has Voted</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredVoters.map(voter => (
                        <tr key={voter.id}>
                            <td>{voter.regNo}</td>
                            <td>{voter.level}</td>
                            <td>{voter.unit}</td>
                            <td>{voter.hasVoted ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VoterListPage;


/*
import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import './VoterListPage.css';


const VotersList = () => {
    const [voters, setVoters] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filteredVoters, setFilteredVoters] = useState([]);
    const [levels, setLevels] = useState([]);
    const [units, setUnits] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const pageSize = 20;

    const fetchVoters = async () => {
        setLoading(true);
        try {
            const votersRef = collection(db, 'voters');
            const q = query(votersRef, orderBy('regNo'), limit(pageSize));
            const snapshot = await getDocs(q);
            const votersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setVoters(votersList);
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        } catch (error) {
            console.error('Error fetching voters:', error);
        } finally {
            setLoading(false);
        }
    };



    const fetchMoreVoters = async () => {
        setLoading(true);
        try {
            const votersRef = collection(db, 'voters');
            const q = query(votersRef, orderBy('regNo'), startAfter(lastVisible), limit(pageSize));
            const snapshot = await getDocs(q);
            const moreVoters = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setVoters(prevVoters => [...prevVoters, ...moreVoters]);
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        } catch (error) {
            console.error('Error fetching more voters:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVoters();
    }, []);

    return (
            <div className="voter-list-container">

            <h1>Registered Voters</h1>
            <div className="filters">
                <div className="filter-item">
                    <label htmlFor="level">Filter by Level:</label>
                    <select
                        id="level"
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                    >
                        <option value="">All Levels</option>
                        {levels.map(level => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-item">
                    <label htmlFor="unit">Filter by Unit:</label>
                    <select
                        id="unit"
                        value={selectedUnit}
                        onChange={(e) => setSelectedUnit(e.target.value)}
                    >
                        <option value="">All Units</option>
                        {units.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                </div>
            </div>
            <ul>
                {voters.map(voter => (
                    <li key={voter.id}>{voter.regNo} - {voter.level} - {voter.unit}</li>
                ))}
            </ul>
            {loading && <p>Loading...</p>}
            <button onClick={fetchMoreVoters} disabled={loading}>Load More</button>
        </div>
    );
};

export default VotersList;
*/