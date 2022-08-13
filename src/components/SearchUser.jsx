import React from 'react';
import {Link} from 'react-router-dom';

const SearchUser = ({data}) => {
    return (
        <div className='w-100'>
            <p className='fs-3 fw-bold ms-3'>Users</p>
            {data.map((user, index) => {
                if (user) {
                    return (
                        <Link
                            tabIndex='0'
                            className='w-100 d-flex justify-content-start bg-white p-3 align-items-center rounded-2 search-item text-decoration-none mb-2'
                            key={index}
                            to={`/profile/${user.uid}`}
                        >
                            <img
                                src={user.avatar}
                                alt='avatar'
                                height='60'
                                width='60'
                                className='rounded-circle me-5'
                            />
                            <p className='fs-4 m-0 text-dark text-decoration-none'>
                                {user.name}
                            </p>
                        </Link>
                    );
                } else {
                    return <p>No user found</p>;
                }
            })}
        </div>
    );
};

export default SearchUser;
