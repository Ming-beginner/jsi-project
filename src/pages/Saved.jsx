import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import {getDoc, doc, db, updateDoc} from '../firebase';
import {useNavigate} from 'react-router-dom';
import {Button, Modal} from 'react-bootstrap';
import {useCurrentUser} from '../firebase';
import {useNavItemContext} from '../context/navItemContext';
import {SavedPost} from '../components';

const SavedPosts = () => {
    const {setActiveNavItem} = useNavItemContext();
    const currentUser = useCurrentUser();
    const navigate = useNavigate();
    const [savedPosts, setSavedPosts] = useState([]);
    const [savedPostRefs, setSavedPostRefs] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    };
    useEffect(() => {
        const getSavedPost = async () => {
            const userRef = doc(db, 'users', currentUser.uid);
            const docSnap = await getDoc(userRef);
            const savedPosts = [];
            if (docSnap.exists()) {
                setSavedPostRefs(docSnap.data().saved);
                if (docSnap.data().saved.length) {
                    for (let i = 0; i < docSnap.data().saved.length; i++) {
                        let postRef = docSnap.data().saved[i];
                        let post = await getDoc(postRef);
                        savedPosts[i] = post.data();
                        savedPosts[i].id = post.id;
                        let authorRef = post.data().author;
                        let author = await getDoc(authorRef);
                        savedPosts[i].author = author.data();
                    }
                    setSavedPosts(savedPosts);
                }
            } else {
                alert('No document found');
            }
        };
        if (!currentUser) {
            navigate('/login');
        } else {
            setActiveNavItem('saved');
            getSavedPost();
        }
    }, [currentUser, navigate, setActiveNavItem]);
    const unsavePost = async (index) => {
        const userRef = doc(db, 'users', currentUser.uid);
        const newSavedPostRefs = [...savedPostRefs].filter(
            (ref, i) => i !== index
        );
        const newSavedPost = [...savedPosts].filter((post, i) => i !== index);
        await updateDoc(userRef, {
            saved: newSavedPostRefs,
        });
        setSavedPostRefs(newSavedPostRefs);
        setSavedPosts(newSavedPost);
    };
    const unsaveAllPosts = async (index) => {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
            saved: [],
        });
        setSavedPostRefs([]);
        setSavedPosts([]);
        setShow(false);
    };
    return (
        <div className='d-flex align-items-center w-100 flex-column p-5'>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to unsave all post?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant='danger' onClick={unsaveAllPosts}>
                        Unsave all
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className='d-flex justify-content-between align-items-center w-100'>
                <p className='fs-1 align-start w-100'>Saved Posts</p>
                <Button
                    variant='primary'
                    className={clsx({'not-allowed': !savedPosts.length})}
                    onClick={() => (savedPosts.length ? setShow(true) : '')}
                >
                    Unsave all
                </Button>
            </div>
            <div className='w-100'>
                {savedPosts
                    ? savedPosts.map((post, index) => {
                          return (
                              <SavedPost
                                  data={post}
                                  key={index}
                                  index={index}
                                  unsavePost={unsavePost}
                              />
                          );
                      })
                    : "You haven't saved any posts"}
            </div>
        </div>
    );
};

export default SavedPosts;
