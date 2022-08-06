import Home from './Home';
import Chatapp from './Chatapp';
import Login from './Login';
import Signup from './Signup';
import Settings from './Settings';
import Profile from './Profile';
import SavedPosts from './SavedPosts';
import ShowPost from './ShowPost';

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
    },
    {
        Page: SavedPosts,
        path: '/saved-posts',
    },
    {
        Page: ShowPost,
        path: '/show-post',
    },
];

export default routes;
