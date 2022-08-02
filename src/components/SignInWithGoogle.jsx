import React from 'react';
import {useSignInWithGoogle} from 'react-firebase-hooks/auth';
import GoogleIcon from '@mui/icons-material/Google';
import {auth} from '../firebase'
import Loading from './Loading'
import ErrorModal from './ErrorModal';
import { useAuth } from '../context/AuthContext';
import {useNavigate} from 'react-router-dom'

const SignInWithGoogle = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const userState = useAuth();
  const navigate = useNavigate();
  const handleSubmt = () =>{
    signInWithGoogle();
  }
  if(user) {
    userState.setCurrentUser(user);
    navigate('/')
  }
  return (
    <>  
        <ErrorModal error={error} />
        <button 
        class='btn btn-lg btn-block btn-primary' style={{background: '#dd4b39'}}
        onClick={handleSubmt}
        >
            <GoogleIcon className='me-2' />
            Sign in with google
        </button>
        <Loading isLoading={loading} />
    </>
  )
}

export default SignInWithGoogle