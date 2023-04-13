import { lazy } from 'react';

// project import
import Loadable from '../../components/Loadable';
import MetaLayout from 'view/layout/MetaLayout';
const GFTHomeMeta = Loadable(lazy(() => import("view/meta/GFTHomeMeta")));

const MetaRoutes = {
    path: '/',
    element: <MetaLayout />,
    children: [
        {
            path: '/meta',
            element: <GFTHomeMeta />
        },
    ]
};



export default MetaRoutes;
