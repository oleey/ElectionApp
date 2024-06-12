import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { useHistory } from "react-router-dom";
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

const RegisterVoter = () => {
    const [data, setData] = useState({
        name: "",
        role: "",
        email: "",
        password: "",
        error: null,
        loading: false,
      });


    const [regNo, setRegNo] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [unit, setUnit] = useState('');
    const [level, setLevel] = useState('');
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                // Sign in anonymously if no user is authenticated
                signInAnonymously(auth).then((userCredential) => {
                    setUser(userCredential.user);
                }).catch((error) => {
                    setMessage('Error authenticating: ' + error.message);
                });
            }
        });

        return () => unsubscribe();
    }, []);

    const registerVoter = async (event) => {
        event.preventDefault();

        setData({ ...data, error: null, loading: true });
    if (!name || !email || !password) {
      setData({ ...data, error: "All fields are required" });
    }

      /*  if (!user) {
            setMessage('User not authenticated');
            return;
        }
            */

        try {
            /*const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
              );*/
              await setDoc(doc(db, "voters", result.user.uid), {
                uid: result.user.uid,
                reg_no: regNo,
                name: name,
                email: email,
                unit: unit,
                level: level // Note: Store hashed passwords in a real application
            });
            setData({
                name:"",
                email:"",
                reg_no: "",
                department: ""
            });
            setMessage('Voter registered successfully!');
        } catch (error) {
            setMessage('Error adding voter: ' + error.message);
        }
    };

    return (
        <div className="container">
            <h1>Accredit Students</h1>
            <form onSubmit={registerVoter}>
                <label>
                    Registration Number:
                    <input type="text" value={regNo} onChange={(e) => setRegNo(e.target.value)} required />
                </label>
                <label>
                    Email Address:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Full Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <label>
                    Unit:
                    <select value={unit} onChange={(e) => setUnit(e.target.value)} required>
                        <option value="">Select Unit</option>
                        <option value="education">Education</option>
                        <option value="socialstudies">Social Studies</option>
                        <option value="pumpernickel">Pumpernickel</option>
                        <option value="reeses">Reeses</option>
                    </select>
                </label>
                <label>
                    Level:
                    <select value={level} onChange={(e) => setLevel(e.target.value)} required>
                        <option value="">Select Level</option>
                        <option value="100l">100l</option>
                        <option value="200l">200l</option>
                        <option value="300l">300l</option>
                        <option value="400l">400l</option>
                    </select>
                </label>

                <button type="submit">Register</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default RegisterVoter;
