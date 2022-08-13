import React, {useEffect, useState} from 'react';
import {useCurrentUser} from '../firebase';
import {useNavigate} from 'react-router-dom';
import {useNavItemContext} from '../context/navItemContext';
import {CreatePost} from '../components';

const Home = () => {
    const navigate = useNavigate();
    const currentUser = useCurrentUser();
    const {setActiveNavItem} = useNavItemContext();
    const [createPostModal, setCreatePostModal] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        } else {
            setActiveNavItem('home');
        }
    });
    useEffect(() => {
        // Applying on mount
        document.body.style.overflow = 'visible';
    }, []);
    if (currentUser) {
        return (
            <div
                className='d-flex justify-content-center w-100 h-100 home-container py-5'
                style={{marginLeft: 238}}
            >
                {createPostModal && (
                    <CreatePost
                        userName={currentUser.displayName}
                        userAvatar={currentUser.photoURL}
                        isVisible={createPostModal}
                        setCreatePostModal={setCreatePostModal}
                        user={currentUser}
                    />
                )}
                <div
                    className='bg-white p-3 d-flex justify-content-between'
                    style={{width: 500, height: 80}}
                >
                    <img
                        src={currentUser.photoURL}
                        alt='avatar'
                        className='rounded-circle border me-3'
                        height={50}
                        width={50}
                    />
                    <button
                        className='rounded-5 border-0 px-3 py-2 flex-fill text-start create-post-btn'
                        style={{
                            background: '#f0f2f5',
                            fontSize: 18,
                            color: '#65676b',
                        }}
                        onClick={() => setCreatePostModal(true)}
                    >
                        What's on your mind, {currentUser.displayName} ?
                    </button>
                </div>
            </div>
        );
    }
};

export default Home;
