import Home from './Home';
import Chatapp from './Chatapp';
import Login from './Login';
import Signup from './Signup';
import Settings from './Settings';
import Profile from './Profile';
import Saved from './Saved';
import Search from './Search';
import SearchPost from './SearchPost';

const routes = [
    {
        Page: Home,
        path: '/',
    },
    {
        Page: Chatapp,
        path: '/chat',
    },
    {
        Page: Login,
        path: '/login',
    },
    {
        Page: Signup,
        path: '/signup',
    },
    {
        Page: Settings,
        path: '/settings',
    },
    {
        Page: Profile,
        path: '/profile',
        subPath: ':uid',
    },
    {
        Page: Saved,
        path: '/saved',
    },
    {
        Page: Search,
        path: '/search',
    },
    {
        Page: SearchPost,
        path: '/post',
        subPath: ':postId',
    },
];

export default routes;
