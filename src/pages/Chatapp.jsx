import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom'
import { useNavItemContext } from '../context/navItemContext';
import { useCurrentUser } from '../firebase';

const Chatapp = () => {
  const {setActiveNavItem} = useNavItemContext();
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  useEffect(() =>{
    if(!currentUser){
      navigate('/login');
    } else {
      setActiveNavItem('chat');
    }
  })
  if(currentUser){
    return (
      <div className='d-flex justify-content-center align-items-center w-100'>Chatapp</div>
    )
  }
}

export default Chatapp