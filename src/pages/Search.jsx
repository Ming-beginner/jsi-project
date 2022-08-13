import React, {useEffect, useState} from 'react';
import {useNavItemContext} from '../context/navItemContext';
import {useCurrentUser} from '../firebase';
import {getUsers, getPosts, getAllUsers} from '../services/search';
import {SearchUser} from '../components';
import {useNavigate, useSearchParams} from 'react-router-dom';

const Search = () => {
    const currentUser = useCurrentUser();
    const {setActiveNavItem} = useNavItemContext();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchUser, setSearchUser] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [showAllUsers, setShowAllUsers] = useState(false);
    const q = searchParams.get('q');
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        } else {
            setActiveNavItem('');
        }
    });
    useEffect(() => {
        const getAllSeacrhUsers = async () => {
            setAllUsers(await getAllUsers(currentUser.uid, q));
        };
        const getSearchUser = async () => {
            setSearchUser(await getUsers(currentUser.uid, q));
        };
        if (currentUser && q) {
            getSearchUser();
        } else {
            setSearchUser([]);
        }
        if (showAllUsers && allUsers.length === 0 && q) {
            getAllSeacrhUsers();
        }
    }, [currentUser, q, allUsers, showAllUsers]);
    return (
        <div className='w-100 d-flex align-items-center flex-column p-5'>
            <p className='fs-1 align-self-start mb-3'>Search results</p>
            <div
                className='w-100 px-2 pb-3 border-bottom'
                style={{maxHeight: 400}}
            >
                <SearchUser data={showAllUsers ? allUsers : searchUser} />
                <button
                    onClick={() => setShowAllUsers(!showAllUsers)}
                    className='ms-3 cursor-pointer mt-2 '
                    style={{
                        background: 'none!important',
                        border: 'none',
                        padding: '0!important',
                        fontFamily: 'arial, sans-serif',
                        color: '#069',
                        textDecoration: 'underline',
                    }}
                >
                    {allUsers.length > 3
                        ? showAllUsers
                            ? 'Show less'
                            : 'Show all'
                        : ''}
                </button>
            </div>
            <div className='d-flex flex-column w-100 px-2 py-3'>
                <p className='fs-3 fw-bold ms-3'>Posts</p>
            </div>
        </div>
    );
};

export default Search;
