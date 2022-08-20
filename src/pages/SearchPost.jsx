import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {doc, onSnapshot, db} from '../firebase';
import {useNavItemContext} from '../context/navItemContext';
import {Post} from '../components';
const SearchPost = () => {
  const {postId} = useParams();
  const {setActiveNavItem} = useNavItemContext();
  const [post, setPost] = useState();
  useEffect(() => {
    setActiveNavItem('');
  });
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'post', postId), (doc) => {
      setPost(doc.data());
    });
    return () => unsub();
  }, [postId]);
  return (
    <div className='d-flex justify-content-center align-items-center w-100'>
      {post ? <Post post={post} /> : <p>No post found!</p>}
    </div>
  );
};

export default SearchPost;
