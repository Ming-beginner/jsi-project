import Home from './Home';
import Chatapp from './Chatapp';
import Login from './Login';
import Signup from './Signup';

const routes = [
    {
        Page: Home,
        path: '/'
    },
    {
        Page: Chatapp,
        path: '/chatapp'
    },
    {
        Page: Login,
        path: '/login'
    },
    {
        Page: Signup,
        path: '/signup'
    }
]

export default routes