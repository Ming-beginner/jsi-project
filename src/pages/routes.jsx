import Home from './Home';
import Chatapp from './Chatapp';
import Login from './Login';
import Signup from './Signup';
import Settings from './Settings';
import Profile from './Profile';
import SavedPosts from './SavedPosts';
import Search from './Search';
import Post from './Post';

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
        Page: SavedPosts,
        path: '/saved-posts',
    },
    {
        Page: Search,
        path: '/search',
    },
    {
        Page: Post,
        path: '/post',
        subPath: ':postId',
    },
];

export default routes;
