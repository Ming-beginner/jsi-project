import React, {useEffect, useState} from 'react';
import {
  useCurrentUser,
  db,
  doc,
  getDoc,
  query,
  collection,
  where,
  orderBy,
  deleteDoc,
  onSnapshot,
  getDocs,
} from '../firebase';
import {useNavItemContext} from '../context/navItemContext';
import {useNavigate, useParams} from 'react-router-dom';
import {Post, ProfileHeader, Loading} from '../components';

const Profile = () => {
  const currentUser = useCurrentUser();
  const {setActiveNavItem} = useNavItemContext();
  const [user, setUser] = useState();
  const [posts, setPosts] = useState();
  const {uid} = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    const getUser = async () => {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUser(userDoc.data());
      } else {
        setUser(null);
      }
    };
    if (!currentUser) {
      navigate('/login');
    } else {
      if (currentUser.uid === uid) {
        setActiveNavItem('profile');
      } else {
        setActiveNavItem('');
      }
      const q = query(
        collection(db, 'post'),
        where('author.uid', '==', uid),
        orderBy('updatedAt', 'desc')
      );
      const unsub = onSnapshot(q, (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          posts.push(doc.data());
        });
        setPosts(posts);
      });
      getUser();
      return () => unsub();
    }
  }, [uid, navigate, setActiveNavItem, currentUser]);
  const handleDeletePost = async (index) => {
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', posts[index].id)
    );
    const newPosts = posts.filter((post, i) => i !== index);
    setPosts(newPosts);
    const deletePostDoc = doc(db, 'post', posts[index].id);
    await deleteDoc(deletePostDoc);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      console.log(doc.ref);
      await deleteDoc(doc.ref);
    });
  };
  return (
    <div
      className='d-flex justify-content-center align-items-center w-100 profile-posts-container'
      style={{marginLeft: 62}}
    >
      {user && posts ? (
        <div className='d-flex flex-column w-100'>
          <ProfileHeader user={user} />
          <div className='w-100 mt-5'>
            {posts.map((post, index) => {
              return (
                <Post
                  key={index}
                  post={post}
                  index={index}
                  handleDeletePost={handleDeletePost}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <Loading isLoading={true} />
      )}
    </div>
  );
};

export default Profile;
