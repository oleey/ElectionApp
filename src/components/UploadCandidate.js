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

        if (!name || !level || !unit ) {
            setMessage('All fields are required');
            setLoading(false);
            return;
        }

       /* if (picture.size > 5 * 1024 * 1024) { // 5 MB size limit
            setMessage('Picture size should be less than 5MB');
            setLoading(false);
            return;
        }*/
/*
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
                        }
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then(resolve)
                            .catch(reject);
                    }
                );
            });
        };*/

        try {
           // const pictureURL = await uploadPicture(picture);
          //  console.log('111Candidate ID:', docRef.id); // You can use the ID for further processing if needed


            await addDoc(collection(db, 'candidates'), {
                name,
                unit,
                level,
                position,
                votes: 0
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
                    <select value={position} onChange={(e) => setPosition(e.target.value)} required>
                    <option value="">Select Position</option>

                    <option value="President">President</option>
                        <option value="Provost">Provost</option>
                        <option value="Public Relation Officer">Public Relation Officer</option>
                        <option value="Treasurer">Treasurer</option>
                        <option value="Vice President">Vice President</option>
                        <option value="Welfare Director">Welfare Director</option>
                        <option value="Assistant General Secretary">Assistant General Secretary</option>
                        <option value="Director of Environment">Director of Environment</option>
                        <option value="Director of Games">Director of Games</option>
                        <option value="Director of Social">Director of Social</option>
                        <option value="Director of Transport">Director of Transport</option>
                        <option value="Financial Secretary">Financial Secretary</option>
                        <option value="General Secretary">General Secretary</option>
                        









                    </select>
                </label>
                
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default UploadCandidate;

/*<label>
                    Picture:
                    <input type="file" accept="image/*" onChange={handlePictureChange} required />
                </label>
                {progress > 0 && (
                    <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                )}
                    */
