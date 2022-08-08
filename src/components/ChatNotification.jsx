import React, {useState} from 'react';
import {Toast} from 'react-bootstrap';
import Moment from 'react-moment';

const ChatNotification = ({lastMsg}) => {
    const [show, setShow] = useState(true);
    return (
        <Toast onClose={() => setShow(false)} delay={5000} autohide show={show}>
            <Toast.Header>
                <img
                    src={lastMsg.authorAvatar}
                    className='rounded-circle me-2'
                    alt='avatar'
                    height={50}
                    width={50}
                />
                <strong className='me-auto'>{lastMsg.authorName}</strong>
                <small className='text-muted'>
                    <Moment fromNow>{lastMsg.createdAt.toDate()}</Moment>
                </small>
            </Toast.Header>
            <Toast.Body>{lastMsg.message}</Toast.Body>
        </Toast>
    );
};

export default ChatNotification;
