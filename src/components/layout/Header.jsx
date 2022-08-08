import React, {useRef, useState, useEffect, useTransition} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {
    Navbar,
    NavDropdown,
    Nav,
    Container,
    InputGroup,
    Form,
} from 'react-bootstrap';
import clsx from 'clsx';
import {
    useCurrentUser,
    signOut,
    auth,
    updateDoc,
    doc,
    db,
    collection,
    query,
    where,
    getDocs,
    onSnapshot,
} from '../../firebase';
import {
    Home,
    Search,
    QuestionAnswer,
    ExitToApp,
    Settings,
    Bookmark,
} from '@mui/icons-material';
import {useNavItemContext} from '../../context/navItemContext';
import SearchUser from '../SearchUser';
import Spinner from 'react-bootstrap/Spinner';
import logo from '../../assets/imgs/logo.png';
import './header.css';

const Header = () => {
    const currentUser = useCurrentUser();
    const navigate = useNavigate();
    const {activeNavItem} = useNavItemContext();
    const [searchResultContainer, setSearchResultContainer] =
        useState('invisible');
    const [searchValue, setSearchValue] = useState('');
    const [searchFilterValue, setSearchFilterValue] = useState('');
    const [searchUser, setSearchUser] = useState([]);
    const [isPending, startTransition] = useTransition();
    const searchRef = useRef();
    const navItemsList = [
        {
            name: 'home',
            path: '/',
            icon: <Home fontSize='large' />,
        },
        {
            name: 'chat',
            path: '/chat',
            icon: <QuestionAnswer fontSize='large' />,
        },
    ];
    const handleSignOut = async () => {
        await updateDoc(doc(db, 'users', currentUser.uid), {isOnline: false});
        await signOut(auth);
        navigate('/login');
    };
    useEffect(() => {
        const getUsers = async () => {
            const users = [];
            const q = query(
                collection(db, 'users'),
                where('uid', 'not-in', [currentUser.uid])
            );

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                users.push(doc.data());
            });
            const userFiltered = users.map((user) => {
                const index = user.name
                    .toLowerCase()
                    .indexOf(searchFilterValue.toLowerCase());
                return index !== -1 ? user : 0;
            });
            setSearchUser(searchFilterValue ? userFiltered : []);
        };
        if (currentUser) {
            getUsers();
        }
    }, [searchFilterValue, currentUser]);
    const [notification, setNotification] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    useEffect(() => {
        if (currentUser) {
            const lastMsgRef = collection(db, 'lastMsg');
            const q = query(lastMsgRef);
            const unsub = onSnapshot(q, (querySnapshot) => {
                let unreadMessages = [];
                querySnapshot.forEach((doc) => {
                    if (
                        doc.data().to === currentUser.uid &&
                        doc.data().unread
                    ) {
                        unreadMessages.push(doc.data());
                    }
                });
                setNotification(!!unreadMessages.length);
                setNotificationCount(unreadMessages.length);
            });
            return () => unsub();
        }
    }, []);
    const handleBlurSearch = (e) => {
        if (e.relatedTarget) {
            if (e.relatedTarget.id === 'searchResultContainer') {
                e.target.focus();
                return;
            } else if (e.relatedTarget.classList.contains('search-item')) {
                setTimeout(() => setSearchResultContainer('invisible'), 100);
                setSearchValue('');
                setSearchFilterValue('');
                return;
            }
        } else {
            setSearchResultContainer('invisible');
        }
    };
    if (currentUser) {
        return (
            <Navbar
                style={{background: '#fff', zIndex: 100}}
                expand='lg'
                className='position-fixed top-0 w-100 shadow-sm '
            >
                <Container
                    fluid
                    className='px-3 d-flex flex-column flex-lg-row'
                >
                    <div className='d-flex align-items-center justify-content-between navbar-top'>
                        <Link className='navbar-brand' to='/'>
                            <img src={logo} alt='logo' height={80} width={80} />
                        </Link>
                        <InputGroup
                            className='w-100 postition-relative'
                            style={{height: 45, maxWidth: 400, zIndex: 3500}}
                        >
                            <Link
                                id='basic-addon1'
                                className='d-flex justify-content-center align-items-center bg-white cursor-pointer border border-dark text-dark px-2'
                                to={`/search?${searchValue}`}
                                onClick={() => {
                                    setSearchResultContainer('invisible');
                                }}
                            >
                                <Search />
                            </Link>
                            <Form.Control
                                className='border-start-0 outline-0 shadow-none border-dark'
                                placeholder='Search'
                                aria-label='Search'
                                aria-describedby='basic-addon1'
                                onChange={(e) => {
                                    setSearchValue(e.target.value);
                                    startTransition(() => {
                                        setSearchFilterValue(e.target.value);
                                    });
                                }}
                                value={searchValue}
                                onFocus={() =>
                                    setSearchResultContainer('visible')
                                }
                                onBlur={handleBlurSearch}
                                ref={searchRef}
                            />
                            <div
                                tabIndex='0'
                                className={clsx(
                                    'position-absolute w-100 bg-white overflow-auto rounded-2 shadow border-top d-flex justify-content-center p-3',
                                    {
                                        'd-none':
                                            searchResultContainer ===
                                            'invisible',
                                    }
                                )}
                                style={{
                                    height: 400,
                                    bottom: -410,
                                    zIndex: 2500,
                                }}
                                id='searchResultContainer'
                            >
                                {isPending ? (
                                    <Spinner
                                        animation='border'
                                        className='align-self-center'
                                    />
                                ) : searchUser.length ? (
                                    <SearchUser data={searchUser} />
                                ) : (
                                    <p className='fs-5 align-self-center'>
                                        Nothing
                                    </p>
                                )}
                            </div>
                        </InputGroup>
                    </div>
                    <Nav className='d-flex align-items-center navbar-bottom'>
                        {navItemsList.map((item) => {
                            return (
                                <div
                                    key={item.path}
                                    className={clsx('me-3 d-flex', {
                                        'navbar-bottom-item-active':
                                            activeNavItem === item.name,
                                    })}
                                >
                                    <Link
                                        className='nav-link rounded-circle d-flex justify-content-center align-items-center position-relative'
                                        style={{
                                            width: 50,
                                            height: 50,
                                            background: 'var(--bg-color)',
                                        }}
                                        to={item.path}
                                    >
                                        {item.icon}
                                        {item.name === 'chat' && (
                                            <div
                                                className={clsx(
                                                    'bg-danger rounded-circle position-absolute bottom-50 end-0 d-flex justify-content-center align-items-center text-white',
                                                    {'d-none': !notification}
                                                )}
                                                style={{height: 20, width: 20}}
                                            >
                                                {notificationCount}
                                            </div>
                                        )}
                                    </Link>
                                </div>
                            );
                        })}
                        <NavDropdown
                            title={
                                <img
                                    height={50}
                                    width={50}
                                    className='rounded-circle navbar-bottom-dropdown'
                                    src={currentUser.photoURL}
                                    alt='avatar'
                                />
                            }
                            id='basic-nav-dropdown'
                            align='end'
                            style={{zIndex: 3000}}
                        >
                            <Link
                                className='dropdown-item'
                                to={`/profile?uid=${currentUser.uid}`}
                            >
                                <img
                                    src={currentUser.photoURL}
                                    className='rounded-circle'
                                    height={40}
                                    width={40}
                                    alt='avatar'
                                />
                                <span className='ms-3'>
                                    {currentUser.displayName}
                                </span>
                            </Link>
                            <Link className='dropdown-item' to='/settings'>
                                <Settings />
                                <span className='ms-3'>Settings</span>
                            </Link>
                            <Link className='dropdown-item' to='/saved-posts'>
                                <Bookmark />
                                <span className='ms-3'>Saved posts</span>
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
        );
    }
};

export default Header;
