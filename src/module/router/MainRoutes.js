import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from "view/layout/MainLayout";

const GFTHomeView = Loadable(lazy(() => import('view/home/GFTHomeView')));
const GGamePage = Loadable(lazy(() => import('view/page/GGamePage')));
const GNewsPage = Loadable(lazy(() => import('view/page/GNewsPage')));
const GVideoPage = Loadable(lazy(() => import('view/page/GVideoPage')));
const GFTNFTDetail = Loadable(lazy(() => import('view/home/GFTNFTDetail')));
const GFTCreateProject = Loadable(lazy(() => import('view/home/GFTCreateProject')));
const GFTMintNFT = Loadable(lazy(() => import('view/home/GFTMintNFT')));
const GHall = Loadable(lazy(() => import('view/page/GHall')));
const GProfile = Loadable(lazy(() => import('view/page/GProfile')));
const GSetting = Loadable(lazy(() => import('view/page/GSetting')));
const GFTGlobal = Loadable(lazy(() => import('view/page/GFTGlobal')));
const GFTFollow = Loadable(lazy(() => import('view/page/GFTFollow')));
const GFTChat = Loadable(lazy(() => import('view/page/GFTChat')));
const GTestIPFS = Loadable(lazy(() => import('view/page/GTestIPFS')));

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <GFTHomeView />,
        },
        // {
        //     path: '/introduce',
        //     element: <GIntroduce />,
        // },
        {
            path: '/detail',
            element: <GFTNFTDetail />,
        },
        {
            path: '/create_project',
            element: <GFTCreateProject />,
        },
        {
            path: '/hall',
            element: <GHall />,
        },
        {
            path: '/global',
            element: <GFTGlobal />,
        },
        {
            path: '/gamepage',
            element: <GGamePage />,
        },
        {
            path: '/newspage',
            element: <GNewsPage />,
        },
        {
            path: '/videopage',
            element: <GVideoPage />,
        },
        {
            path: '/follow',
            element: <GFTFollow />,
        },
        {
            path: '/mint',
            element: <GFTMintNFT />,
        },
        {
            path: '/chat',
            element: <GFTChat />,
        },
        {
            path: '/profile',
            element: <GProfile />,
        },
        {
            path: '/setting',
            element: <GSetting />,
        },
        {
            path: '/ipfs',
            element: <GTestIPFS />,
        }
    ]
};

// MainRoutes.children = MainRoutes.children
//     .concat(ABasicFunctionRoutes)
//     .concat(AFarmRoutes)
//     .concat(AWalletRoutes)
//     .concat(ASysRoutes)
//     .concat(AUserRoutes)
//     .concat(AConfigRoutes)
//     .concat(ARuleRoutes)
//     .concat(ANewsRoutes);
// //
// MainRoutes.children = MainRoutes.children.concat(OhGameRoutes).concat(OhWalletRoutes).concat(OhTaskRoutes);

export default MainRoutes;
