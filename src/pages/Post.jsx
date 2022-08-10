import React, {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useNavItemContext} from '../context/navItemContext';
import {useCurrentUser} from '../firebase';

const Post = () => {
    const currentUser = useCurrentUser();
    const {postId} = useParams();
    const {setActiveNavItem} = useNavItemContext();
    const navigate = useNavigate();
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        } else {
            setActiveNavItem('');
        }
    });
    return <div>Post</div>;
};

export default Post;
