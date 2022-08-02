import Home from './Home';
import Chatapp from './Chatapp';
import Login from './Login';

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
    }
]

export default routes