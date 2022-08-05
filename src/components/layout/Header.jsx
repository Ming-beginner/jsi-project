import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Navbar, NavDropdown, Nav, Container, InputGroup, Form} from 'react-bootstrap';
import clsx from 'clsx';
import {useCurrentUser, signOut, auth, updateDoc, doc, db} from '../../firebase';
import {Home, Search, QuestionAnswer, ExitToApp, Settings} from '@mui/icons-material';
import { useNavItemContext } from '../../context/navItemContext';
import logo from '../../assets/imgs/logo.png';
import './header.css';

const Header = () => {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const {activeNavItem} = useNavItemContext();
  const navItemsList = [
    {
      name:'home',
      path: '/',
      icon: <Home fontSize='large' />
    },
    {
      name:'chat',
      path: '/chat',
      icon: <QuestionAnswer fontSize='large' />
    }
  ];
  const handleSignOut = async () =>{
    await updateDoc(doc(db, 'users', currentUser.uid), {isOnline: false});
    await signOut(auth);
    navigate('/login');
  }
  if(currentUser){
    return (
      <Navbar style={{background: '#fff', zIndex: 100}} expand='lg' className='position-fixed top-0 w-100 shadow-sm '>
        <Container fluid className='px-3 d-flex flex-column flex-lg-row'>
          <div className='d-flex align-items-center justify-content-between navbar-top'>
            <Link className='navbar-brand' to='/'>
              <img src={logo} alt='logo' height={80} width={80} />
            </Link>
            <InputGroup className='w-100' style={{height: 45, maxWidth: 400}}>
              <InputGroup.Text id='basic-addon1' className='bg-white cursor-pointer border-dark'>
                <Search />
              </InputGroup.Text>
              <Form.Control
                className='border-start-0 outline-0 shadow-none border-dark'
                placeholder='Search'
                aria-label='Search'
                aria-describedby='basic-addon1'
              />
            </InputGroup>
          </div>
          <Nav className='d-flex align-items-center navbar-bottom'>
            {navItemsList.map(item=>{
              return (
                <div key={item.path} className={clsx('me-3 d-flex', {'navbar-bottom-item-active':activeNavItem===item.name })}>
                  <Link className='nav-link rounded-circle d-flex justify-content-center align-items-center' style={{width: 50, height: 50, background:'var(--bg-color)'}} to={item.path}>
                    {item.icon}
                  </Link>
                </div>
              )
            })}
            <NavDropdown 
              title={<img height={50} width={50} className='rounded-circle navbar-bottom-dropdown' src={currentUser.photoURL} alt='avatar' />} 
              id='basic-nav-dropdown' 
              align='end'
              style={{zIndex: 3000}}
            >
              <Link className='dropdown-item' to='/profile'>
                <img src={currentUser.photoURL} className='rounded-circle' height={40} width={40} alt='avatar'/>
                <span className='ms-3'>{currentUser.displayName}</span>
              </Link>
              <Link className='dropdown-item' to='/setting'>
                <Settings />
                <span className='ms-3'>Settings</span>
              </Link>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleSignOut}>
                <ExitToApp />
                <span className='ms-3'>Sign out</span>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
    )
  }
}

export default Header
