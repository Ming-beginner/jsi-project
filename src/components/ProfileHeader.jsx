import React, {useEffect, useState} from 'react';
import {useCurrentUser} from '../firebase';
import {Link} from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

const ProfileHeader = ({user}) => {
  const currentUser = useCurrentUser();
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  useEffect(() => {
    if (currentUser) {
      setIsCurrentUser(currentUser.uid === user.uid);
    }
  }, []);
  return (
    <div className='position-absolute d-flex py-4 px-5 bg-white align-items-center profile-header shadow-sm flex-column flex-lg-row'>
      <div style={{height: 100, width: 100}}>
        <img
          src={user.avatar}
          alt='avatar'
          className='w-100 rounded-circle border'
          style={{aspectRatio: '1/1'}}
        />
      </div>
      <div className='d-flex ms-0 ms-lg-4 align-items-center justify-content-between w-100 align-items-lg-start'>
        <div className='d-flex flex-column justify-content-center'>
          <p className='fs-2'>{user.name}</p>
          {user.bio && (
            <small className='text-black-50 d-block text-center'>
              {user.bio}
            </small>
          )}
        </div>
        {isCurrentUser && (
          <Link
            role='button'
            to='/settings'
            className='ms-lg-auto text-dark border-0 p-2 rounded-circle d-block'
            style={{
              background: 'rgb(200, 200, 200)',
              aspectRatio: '1/1',
            }}
          >
            <EditIcon />
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
