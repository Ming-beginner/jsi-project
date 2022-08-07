import React, {useEffect, useRef} from 'react';
import Moment from 'react-moment';
import './message.css';

const Message = ({msg, createdAt, media, user1, sender}) => {
    const scrollRef = useRef();

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [msg]);
    return (
        <div
            className={`message-wrapper ${user1 === sender ? 'own' : ''}`}
            ref={scrollRef}
        >
            <p className={sender === user1 ? 'me' : 'friend'}>
                {media ? (
                    <img src={media} alt={msg} className='w-100 rounded-2' />
                ) : null}
                {msg}
                <br />
                <small className='d-inline-block mt-2 opacity-75'>
                    <Moment fromNow>{createdAt.toDate()}</Moment>
                </small>
            </p>
        </div>
    );
};

export default Message;
