import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom'
import { useNavItemContext } from '../context/navItemContext';
import { useCurrentUser } from '../firebase';
import {db,auth} from '../firebase';
import {collection,query , where,onSnaphot} from '../firebase'
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
const Home = () => {
  const [chat, setChat] = useState("");
  useEffect (() => {
    const usersRef =collection (db,"users");
    const q = query(usersRef,where("uid","not-in",[auth,currentUser,uid]));
    const unsub = onSnaphot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
    return () => unsub();
  },[]);
  const selectUser =(user) => {
    setChat(user);
    console.log(user);
  }
  return <div className='home_container'>
    <div className="users_cointainer">
      {users.map(user => <User key={user.uid} user={user} selectUser={selectUser}/>)}
    </div>
    <div className="messages_container">
      {chat ? <div className='messages_user'>
          <h3>{chat.name}</h3>
          </div>:<h3 className="no_conv">Select a user to start  a conservation </h3>} 
    </div>
  </div>
  
};
export { Chatapp };
export default Home