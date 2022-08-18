import React, {useEffect, useState} from 'react';
import {
  useCurrentUser,
  onSnapshot,
  query,
  collection,
  db,
  orderBy,
  doc,
  getDoc,
} from '../firebase';
import {useNavigate} from 'react-router-dom';
import {useNavItemContext} from '../context/navItemContext';
import {CreatePost, Post, Loading} from '../components';

const Home = () => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const {setActiveNavItem} = useNavItemContext();
  const [createPostModal, setCreatePostModal] = useState(false);
  const [posts, setPosts] = useState();
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      setActiveNavItem('home');
      document.body.style.overflow = 'visible';
      const q = query(collection(db, 'post'), orderBy('updatedAt', 'desc'));
      const unsub = onSnapshot(q, (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          posts.push(doc.data());
        });
        setPosts(posts);
      });
      return () => unsub();
    }
  }, [currentUser, navigate, setActiveNavItem]);
  return (
    <div
      className='d-flex  w-100 h-100 home-container py-5 flex-column align-items-center'
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
      {currentUser && (
        <div
          className='bg-white p-3 d-flex justify-content-between create-post-btn'
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
      )}
      {posts ? (
        <div className='d-flex flex-column align-items-center mt-4'>
          {posts.map((post, index) => {
            return <Post key={index} post={post} index={index} />;
          })}
        </div>
      ) : (
        <Loading isLoading={true} />
      )}
    </div>
  );
};

export default Home;
