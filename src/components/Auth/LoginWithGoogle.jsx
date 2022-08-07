import React from 'react';
import {useSignInWithGoogle} from 'react-firebase-hooks/auth';
import GoogleIcon from '@mui/icons-material/Google';
import {Button} from 'react-bootstrap';
import {auth, doc, db, setDoc} from '../../firebase';
import ErrorModal from '../ErrorModal';
import Loading from '../Loading';
import {useNavigate} from 'react-router-dom';

const LogInWithGoogle = () => {
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
    const navigate = useNavigate();
    const handleSubmt = () => {
        signInWithGoogle();
    };
    const saveUserInfo = async () => {
        const userDoc = doc(db, 'users', user.user.uid);
        await setDoc(userDoc, {
            uid: user.user.uid,
            name: user.user.displayName,
            email: user.user.email,
            avatar: user.user.photoURL,
            isOnline: true,
            bio: '',
        });
        navigate('/');
    };
    if (user) {
        saveUserInfo();
    }

    return (
        <div className='w-50 border mb-3'>
            <ErrorModal error={error} />
            <Loading isLoading={loading} />
            <Button
                className='btn w-100'
                style={{background: '#dd4b39', border: '1px solid #dd4b39'}}
                onClick={handleSubmt}
            >
                <GoogleIcon className='me-2' />
                Continue with google
            </Button>
        </div>
    );
};

export default LogInWithGoogle;
