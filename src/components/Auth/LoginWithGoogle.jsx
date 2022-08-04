import React from 'react';
import {useSignInWithGoogle} from 'react-firebase-hooks/auth';
import GoogleIcon from '@mui/icons-material/Google';
import {Button} from 'react-bootstrap';
import {auth} from '../../firebase';
import ErrorModal from '../ErrorModal';
import Loading from '../Loading'
import {useNavigate} from 'react-router-dom';

const LogInWithGoogle = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const navigate = useNavigate();
  const handleSubmt = () =>{
    signInWithGoogle();
  }
  if(user) {
    navigate('/');
  }
  return (
    <div className="w-50 border mb-3">  
        <ErrorModal error={error} />
        <Loading isLoading={loading} />
        <Button 
          className='btn w-100' style={{background: '#dd4b39', border: '1px solid #dd4b39'}}
          onClick={handleSubmt} 
        >
            <GoogleIcon className='me-2' />
            Continue with google
        </Button>
    </div>
  )
}

export default LogInWithGoogle