import React, { useState } from 'react';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc, DocumentReference } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const UploadCandidate = () => {
    const [name, setName] = useState('');
    const [unit, setUnit] = useState('');
    const [level, setLevel] = useState('');
    const [position, setPosition] = useState('');
    const [picture, setPicture] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handlePictureChange = (e) => {
        if (e.target.files[0]) {
            setPicture(e.target.files[0]);
        }
    };

    const uploadCandidate = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');
        setProgress(0);

        if (!name || !level || !unit || !picture) {
            setMessage('All fields are required');
            setLoading(false);
            return;
        }

       /* if (picture.size > 5 * 1024 * 1024) { // 5 MB size limit
            setMessage('Picture size should be less than 5MB');
            setLoading(false);
            return;
        }*/

        const uploadPicture = async (picture) => {
            return new Promise((resolve, reject) => {
                const storageRef = ref(storage, `candidates/${picture.name}`);
                const uploadTask = uploadBytesResumable(storageRef, picture);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setProgress(progress);
                    },
                    (error) => {
                       /* if (error.code === 'storage/retry-limit-exceeded') {
                            setTimeout(() => {
                                uploadPicture(picture).then(resolve).catch(reject);
                            }, 2000); // retry after 2 seconds
                        } else {
                            reject(error);
                        }*/
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then(resolve)
                            .catch(reject);
                    }
                );
            });
        };

        try {
            const pictureURL = await uploadPicture(picture);
          //  console.log('111Candidate ID:', docRef.id); // You can use the ID for further processing if needed


            await addDoc(collection(db, 'candidates'), {
                name,
                unit,
                level,
                position,
                pictureURL,
                votescount: 0
            });

           // console.log('Candidate ID:', result.id); // You can use the ID for further processing if needed


            setName('');
            setUnit('');
            setLevel('');
            setPosition('');
            setPicture(null);
            setMessage('Candidate uploaded successfully!');

        } catch (error) {
            setMessage('Error uploading candidate: ' + error.message);
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };

    return (
        <div className="container">
            <h1>Upload Candidate</h1>
            <form onSubmit={uploadCandidate}>
                <label>
                    Full Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <label>
                    Unit:
                    <select value={unit} onChange={(e) => setUnit(e.target.value)} required>
                        <option value="">Select Unit</option>
                        <option value="Political Science Edu">Political Science Edu</option>
                        <option value="Social Studies">Social Studies</option>
                        <option value="Economics Edu">Economics Edu</option>
                        <option value="Geography Edu">Geography Edu</option>
                    </select>
                </label>
                <label>
                    Level:
                    <select value={level} onChange={(e) => setLevel(e.target.value)} required>
                        <option value="">Select Level</option>
                        <option value="100L">100L</option>
                        <option value="200L">200L</option>
                        <option value="300L">300L</option>
                        <option value="400L">400L</option>
                    </select>
                </label>
                <label>
                    Position:
                    <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} required />
                </label>
                <label>
                    Picture:
                    <input type="file" accept="image/*" onChange={handlePictureChange} required />
                </label>
                {progress > 0 && (
                    <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                )}
                <button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default UploadCandidate;
