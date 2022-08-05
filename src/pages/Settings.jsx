import React, {useEffect} from 'react';
import {useCurrentUser} from '../firebase';
import {useNavigate} from 'react-router-dom';
import { useNavItemContext } from '../context/navItemContext';

const Setting = () => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const {setActiveNavItem} = useNavItemContext();
  useEffect(()=>{
    if(!currentUser){
      navigate('/login')
    } else {
      setActiveNavItem('settings');
    }
  });
  if(currentUser){
    return (
      <div className='d-flex justify-content-center align-items-center w-100'>Setting</div>
    )
  }
}

export default Setting