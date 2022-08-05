import Home from './Home';
import { Chatapp } from './Chatapp';
import Login from './Login';
import Signup from './Signup';
import Settings from './Settings';
import Profile from './Profile';

const routes = [
    {
        Page: Home,
        path: '/'
    },
    {
        Page: Chatapp,
        path: '/chat'
    },
    {
        Page: Login,
        path: '/login'
    },
    {
        Page: Signup,
        path: '/signup'
    },
    {
        Page: Settings,
        path: '/settings'
    },
    {
        Page: Profile,
        path: '/profile'
    }
]

export default routes