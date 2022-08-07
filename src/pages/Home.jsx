import React, {useEffect} from 'react';
import {useCurrentUser} from '../firebase';
import {useNavigate} from 'react-router-dom';
import {useNavItemContext} from '../context/navItemContext';

const Home = () => {
    const navigate = useNavigate();
    const currentUser = useCurrentUser();
    const {setActiveNavItem} = useNavItemContext();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        } else {
            setActiveNavItem('home');
        }
    });
    if (currentUser) {
        return (
            <div className='d-flex justify-content-center align-items-center w-100'>
                Hello user {currentUser.displayName}
            </div>
        );
    }
};

export default Home;
