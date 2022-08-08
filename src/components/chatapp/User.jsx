import React, {useEffect, useState} from 'react';
import img from '../../assets/imgs/default-avatar.png';
import {db, onSnapshot, doc} from '../../firebase';
import './user.css';

const User = ({user, selectUser, user1}) => {
    const user2 = user?.uid;
    const [data, setData] = useState('');

    useEffect(() => {
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        let unsub = onSnapshot(doc(db, 'lastMsg', id), (doc) => {
            setData(doc.data());
        });
        return () => unsub();
    }, []);
    return (
        <div
            className='d-flex flex-column py-2 user-wrapper w-100'
            onClick={() => selectUser(user)}
        >
            <div className='d-flex justify-content-between align-items-center'>
                <div className='d-flex align-items-center p-2'>
                    <img
                        src={user.avatar || img}
                        height={56}
                        width={56}
                        alt='avatar'
                        className='rounded-circle'
                    />
                    <h4 className='ms-3'>{user.name}</h4>
                    {data?.from !== user1 && data?.unread && (
                        <small className='bg-danger rounded-pill text-white ms-1 px-1'>
                            New
                        </small>
                    )}
                </div>
                <div
                    className={`user-status ${
                        user.isOnline ? 'online' : 'offline'
                    } me-3`}
                ></div>
            </div>
            {data && (
                <p
                    className='mx-3'
                    style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    <strong>{data.from === user1 && 'Me : '}</strong>
                    {data.message}
                </p>
            )}
        </div>
    );
};
export default User;
