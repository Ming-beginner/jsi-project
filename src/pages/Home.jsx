import React, {useEffect} from 'react';
import { useAuth } from '../context/AuthContext';
import {auth, signOut} from '../firebase';
import {useNavigate} from 'react-router-dom';

const Home = () => {
  const {currentUser}= useAuth();
  const navigate = useNavigate();
  const handleSignOut = () =>{
    signOut(auth)
    .then(() =>navigate('/login'));
  }
  useEffect(()=>{
    if(!currentUser){
      navigate('/login')
    } else {
      console.log(currentUser);
    }
  }, [currentUser, navigate]);
  if(currentUser){
    return (
      <div>
        Hello user {currentUser.displayName}
        <button onClick={handleSignOut}>Sign out</button>
      </div>
    )
  }
}

export default Home