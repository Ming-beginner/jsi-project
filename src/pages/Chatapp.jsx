import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import {useNavigate} from 'react-router-dom';
import {useNavItemContext} from '../context/navItemContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    useCurrentUser,
    db,
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    setDoc,
    getDoc,
    updateDoc,
    Timestamp,
    getDownloadURL,
    uploadBytes,
    storage,
    ref,
    orderBy,
    doc,
} from '../firebase';
import {User, MessageForm, Message} from '../components';

const Chatapp = () => {
    const {setActiveNavItem} = useNavItemContext();
    const [chat, setChat] = useState('');
    const [users, setUsers] = useState([]);
    const [img, setImg] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const currentUser = useCurrentUser();
    const navigate = useNavigate();
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        } else {
            setActiveNavItem('chat');
            document.body.style.overflow = 'hidden';
        }
    });
    useEffect(() => {
        if (currentUser) {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('uid', 'not-in', [user1]));
            const unsub = onSnapshot(q, (querySnapshot) => {
                let users = [];
                querySnapshot.forEach((doc) => {
                    users.push(doc.data());
                });
                setUsers(users);
            });
            return () => unsub();
        }
    }, []);
    const user1 = currentUser ? currentUser.uid : '';
    const selectUser = async (user) => {
        setChat(user);
        const user2 = user.uid;
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        const messageRef = collection(db, 'message', id, 'chat');
        const q = query(messageRef, orderBy('createdAt', 'asc'));
        onSnapshot(q, (querySnapshot) => {
            let messages = [];
            querySnapshot.forEach((doc) => {
                messages.push(doc.data());
            });
            setMessages(messages);
        });
        const docSnap = await getDoc(doc(db, 'lastMsg', id));
        if (docSnap.data().from !== user1) {
            await updateDoc(doc(db, 'lastMsg', id), {
                unread: false,
            });
        }
    };
    const handleChat = async (e) => {
        e.preventDefault();
        const user2 = chat.uid;
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        let url;
        if (message.length || img) {
            if (img) {
                const imgRef = ref(
                    storage,
                    `images/${new Date().getTime()} - ${img.name}}`
                );
                const snap = await uploadBytes(imgRef, img);
                const downloadUrl = await getDownloadURL(
                    ref(storage, snap.ref.fullPath)
                );
                url = downloadUrl;
            }
            await addDoc(collection(db, 'message', id, 'chat'), {
                message,
                from: user1,
                to: user2,
                createdAt: Timestamp.fromDate(new Date()),
                media: url || '',
            });
            await setDoc(doc(db, 'lastMsg', id), {
                message,
                from: user1,
                to: user2,
                createdAt: Timestamp.fromDate(new Date()),
                media: url || '',
                unread: true,
                authorName: currentUser.displayName,
                authorAvatar: currentUser.photoURL,
            });
            setMessage('');
        }
    };

    if (currentUser) {
        return (
            <div className='d-flex justify-content-center align-items-center w-100'>
                <div
                    className='d-flex h-100 w-100 border border-end'
                    style={{marginLeft: 350}}
                >
                    <div
                        className='border position-fixed h-100 bg-white p-2 chat-user-container'
                        style={{left: 62, overflowY: 'scroll', width: 350}}
                    >
                        {users.map((user) => (
                            <User
                                key={user.uid}
                                user={user}
                                selectUser={selectUser}
                                user1={user1}
                            />
                        ))}
                    </div>
                    <div
                        className={clsx(
                            'bg-white flex-fill position-relative justify-content-center w-100 bottom-0 chat-messages-container',
                            {'chat-messages-container-active': chat}
                        )}
                        style={{
                            height: 'calc(100vh - 106px)',
                            zIndex: 1,
                            top: 106,
                        }}
                    >
                        {chat ? (
                            <>
                                <div
                                    className='text-center border border-bottom position-absolute top-0 w-100 py-3 d-flex align-items-center justify-content-center bg-white chat-header'
                                    style={{zIndex: 4}}
                                >
                                    <div
                                        className='d-flex d-lg-none justify-content-center align-items-center cursor-pointer'
                                        onClick={() => setChat('')}
                                    >
                                        <ArrowBackIcon fontSize='large' />
                                    </div>
                                    <div className='text-center d-flex flex-row-reverse flex-lg-row align-items-center w-100 justify-content-between'>
                                        <img
                                            className='me-auto rounded-circle'
                                            width={65}
                                            height={65}
                                            alt='logo'
                                            src={chat.avatar}
                                        />
                                        <h3 className='text-center flex-fill'>
                                            {chat.name}
                                        </h3>
                                    </div>
                                </div>
                                <div
                                    className='message-container position-absolute bottom-0 w-100'
                                    style={{
                                        height: 'calc(100% - 99px)',
                                        overflowY: 'scroll',
                                    }}
                                >
                                    <div
                                        className='messages'
                                        style={{marginBottom: 88}}
                                    >
                                        {messages.length
                                            ? messages.map((message, index) => {
                                                  return (
                                                      <Message
                                                          user1={user1}
                                                          key={index}
                                                          msg={message.message}
                                                          createdAt={
                                                              message.createdAt
                                                          }
                                                          media={message.media}
                                                          sender={message.from}
                                                      />
                                                  );
                                              })
                                            : null}
                                    </div>
                                    <MessageForm
                                        handleSubmit={handleChat}
                                        message={message}
                                        setMessage={setMessage}
                                        setImg={setImg}
                                    />
                                </div>
                            </>
                        ) : (
                            <h3 className='text-center p-2'>
                                Select a user to start a conservation
                            </h3>
                        )}
                    </div>
                </div>
            </div>
        );
    }
};
export default Chatapp;
