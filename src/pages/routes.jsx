import Home from './Home';
import Chatapp from './Chatapp';
import Login from './Login';
import Signup from './Signup';
import Setting from './Setting';
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
        Page: Setting,
        path: '/setting'
    },
    {
        Page: Profile,
        path: '/profile'
    }
]

export default routes