import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {getPostsById} from '../services/search';
import {useNavItemContext} from '../context/navItemContext';
const Post = () => {
    const {postId} = useParams();
    const {setActiveNavItem} = useNavItemContext();
    const [post, setPost] = useState();
    useEffect(() => {
        setActiveNavItem('');
    });
    useEffect(() => {
        const getPost = async () => {
            const post = await getPostsById(postId);
            setPost(post);
        };
        getPost();
    }, [postId]);
    return <div></div>;
};

export default Post;
