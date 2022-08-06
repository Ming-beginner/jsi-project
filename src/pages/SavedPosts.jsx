import React, {useEffect} from 'react';

import {useNavigate} from 'react-router-dom';
import {useCurrentUser} from '../firebase';
import {useNavItemContext} from '../context/navItemContext';

const SavedPosts = () => {
    const {setActiveNavItem} = useNavItemContext();
    const currentUser = useCurrentUser();
    const navigate = useNavigate();
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        } else {
            setActiveNavItem('saved-posts');
        }
    });
    return (
        <div className='d-flex justify-content-center align-items-center w-100'>
            Saved Posts
        </div>
    );
};

export default SavedPosts;
