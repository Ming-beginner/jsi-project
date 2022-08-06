import React from 'react';
import {Home, QuestionAnswer, Settings, Bookmark} from '@mui/icons-material';
import {Link} from 'react-router-dom';
import clsx from 'clsx';
import './sidebar.css';
import {useNavItemContext} from '../../context/navItemContext';

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
                            'text-decoration-none w-100 p-2 d-flex cursor-pointer sidebar-item my-2',
                            {'sidebar-item-active': activeNavItem === item.name}
                        )}
                    >
                        {item.icon}
                        <span className='ms-4 sidebar-item-name'>
                            {item.title}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
};

export default Sidebar;
