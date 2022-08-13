import React, {useEffect, useState} from 'react';
import {useCurrentUser, db, doc, getDoc} from '../firebase';
import {useNavItemContext} from '../context/navItemContext';
import {useNavigate, useParams} from 'react-router-dom';
import {Post, ProfileHeader} from '../components';
import defaultAvatar from '../assets/imgs/default-avatar.png';
import {getPostsByUid} from '../services/search';

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
    const getPosts = async () => {
      const posts = await getPostsByUid(uid);
      setPosts(posts);
    };
    if (!currentUser) {
      navigate('/login');
    } else {
      if (currentUser.uid === uid) {
        setActiveNavItem('profile');
      } else {
        setActiveNavItem('');
      }
      getUser();
      getPosts();
    }
  }, [uid, navigate, setActiveNavItem, currentUser]);

  const mockPosts = [
    {
      id: 1,
      author: {
        uid: '5oaPenCF1GhwBapGM5p3KvMON112',
        name: 'Ming',
        avatar:
          'https://lh3.googleusercontent.com/a-/AFdZucq_svPlKTbaBEVvP7Hh23F6WfmvCInjBC9AupUj=s96-c',
      },
      likes: 1,
      comments: {
        count: 1,
        comments: [
          {
            authorName: 'Ming',
            authorAvatar: defaultAvatar,
            content: 'Hello',
            answer: [],
            likes: 1,
          },
        ],
      },
      image: null,
      content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. `,
      createdAt: 'an hour ago',
    },
  ];
  return (
    <div
      className='d-flex justify-content-center align-items-center w-100 profile-posts-container'
      style={{marginTop: 130, marginLeft: 62}}
    >
      {user ? (
        <div className='d-flex flex-column'>
          <ProfileHeader user={user} />
          <div className='w-100 mt-3'>
            {posts.map((post, index) => {
              return <Post key={index} post={post} />;
            })}
          </div>
        </div>
      ) : (
        'No user!'
      )}
    </div>
  );
};

export default Profile;
