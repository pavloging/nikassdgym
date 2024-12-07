import Main from './pages/Main';
import Reset from './pages/Reset';
import NotFound from './pages/NotFound';
import Password from './pages/Password';
import Policy from './pages/Policy';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Subscription from './pages/Subscription';
import ExercisesList from './pages/ExercisesList';
import Exercise from './pages/Exercise';
import Agreement from './pages/Agreement';
import Offerta from './pages/Offerta';

const routes = [
    {
        path: 'registration',
        element: <Registration />
    },
    {
        path: 'login',
        element: <Login />,
    },
    {
        path: 'reset',
        element: <Reset />,
    },
    {
        path: 'password',
        element: <Password />
    },
    {
        path: 'offerta',
        element: <Offerta />
    },
    {
        path: 'policy',
        element: <Policy />
    },
    {
        path: 'agreement',
        element: <Agreement />
    },
    {
        path: 'subscription',
        element: <Subscription />
    },
    {
        path: 'exercises',
        element: <ExercisesList />
    },
]

export const defaultRoutes = [
    ...routes,
    {
        path: '*',
        element: <Main />,
    },
];

export const authRoutes = [
    ...routes,
    {
        path: '/',
        element: <Main />,
    },
    {
        path: 'exercises/:name',
        element: <Exercise />
    },
    {
        path: '*',
        element: <NotFound />,
    },
];
