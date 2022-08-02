import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const Home = () => {
  const [user, loading, error] = useAuthState(auth)
  return (
    <div>SocialMedia</div>
  )
}

export default Home