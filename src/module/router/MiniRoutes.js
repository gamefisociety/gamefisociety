import { lazy } from 'react';

// project import
import Loadable from '../../components/Loadable';

import MiniLayout from 'view/layout/MiniLayout';
const GIntroduce = Loadable(lazy(() => import('view/page/GIntroduce')));

const MiniRoutes = {
    path: '/',
    element: <MiniLayout />,
    children: [
        {
            path: 'introduce',
            element: <GIntroduce />
        },
    ]
};



export default MiniRoutes;
