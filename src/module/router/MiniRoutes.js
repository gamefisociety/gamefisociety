import { lazy } from 'react';

// project import
import Loadable from '../../components/Loadable';

import MiniLayout from 'view/layout/MiniLayout';
const GIntroduce = Loadable(lazy(() => import('view/page/GIntroduce')));
const GMintNFT = Loadable(lazy(() => import('view/page/GMintNFT')));
const MiniRoutes = {
    path: '/',
    element: <MiniLayout />,
    children: [
        {
            path: '/introduce',
            element: <GIntroduce />
        },
        {
            path: '/mint',
            element: <GMintNFT />
        },
    ]
};



export default MiniRoutes;
