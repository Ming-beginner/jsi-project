import React, {useEffect, useState} from 'react';
import {Home, QuestionAnswer, Settings, Bookmark} from '@mui/icons-material';
import {Link} from 'react-router-dom';
import clsx from 'clsx';
import {useNavItemContext} from '../../context/navItemContext';
import {
    db,
    useCurrentUser,
    query,
    onSnapshot,
    collection,
} from '../../firebase';
import './sidebar.css';

const Sidebar = () => {
    const {activeNavItem} = useNavItemContext();
    const sidebarItemsList = [
        {
            name: 'home',
            path: '/',
            title: 'Home',
            icon: <Home fontSize='large' />,
        },
        {
            name: 'chat',
            path: '/chat',
            title: 'Chat',
            icon: <QuestionAnswer fontSize='large' />,
        },
        {
            name: 'settings',
            path: '/settings',
            title: 'Settings',
            icon: <Settings fontSize='large' />,
        },
        {
            name: 'saved-posts',
            path: '/saved-posts',
            title: 'Saved posts',
            icon: <Bookmark fontSize='large' />,
        },
    ];
    const currentUser = useCurrentUser();
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
    return (
        <div
            className={clsx(
                'sidebar position-fixed start-0 border border-end bg-white h-100 shadow',
                {'sidebar-active': activeNavItem === 'home'}
            )}
        >
            {sidebarItemsList.map((item) => {
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={clsx(
                            'text-decoration-none w-100 p-2 d-flex cursor-pointer sidebar-item my-2 position-relative',
                            {'sidebar-item-active': activeNavItem === item.name}
                        )}
                    >
                        {item.icon}
                        <span className='ms-4 sidebar-item-name'>
                            {item.title}
                        </span>
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
                );
            })}
        </div>
    );
};

export default Sidebar;
