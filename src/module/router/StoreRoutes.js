import { lazy } from 'react';

// project import
import Loadable from '../../components/Loadable';
import StoreLayout from 'view/layout/StoreLayout';

const GStore = Loadable(lazy(() => import('view/store/GStore')));

const StoreRoutes = {
    path: '/',
    element: <StoreLayout />,
    children: [
        {
            path: '/store',
            element: <GStore />
        },
    ]
};



export default StoreRoutes;
