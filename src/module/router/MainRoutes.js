import { lazy } from 'react';

// project import
import Loadable from '../../components/Loadable';
import GFTHome from "../../view/home/GFTHome";

const GFTHomeView = Loadable(lazy(() => import('view/home/GFTHomeView')));
const GFTNFTDetail = Loadable(lazy(() => import('view/home/GFTNFTDetail')));
const GFTCreateProject = Loadable(lazy(() => import('view/home/GFTCreateProject')));

// // render - dashboard
// const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
// //任务服务
// const MissionFrame = Loadable(lazy(() => import('pages/mission/MissionFrame')));
// const MissionGroupFrame = Loadable(lazy(() => import('pages/mission/MissionGroupFrame')));
// const UserMissionFrame = Loadable(lazy(() => import('pages/mission/UserMissionFrame')));
// //
// const AirDropFrame = Loadable(lazy(() => import('pages/airdrop/AirDropFrame')));
// const WhiteListFrame = Loadable(lazy(() => import('pages/airdrop/WhiteListFrame')));
// //level
// const StarFrame = Loadable(lazy(() => import('pages/level/StarFrame')));
// const InviteRuleFrame = Loadable(lazy(() => import('pages/level/InviteRuleFrame')));
// //log
// const GoodsLogFrame = Loadable(lazy(() => import('pages/logpage/GoodsLogFrame')));
// const SwapLogFrame = Loadable(lazy(() => import('pages/logpage/SwapLogFrame')));
// const FeedbackFrame = Loadable(lazy(() => import('pages/logpage/FeedbackFrame')));
// const BillLogFrame = Loadable(lazy(() => import('pages/logpage/BillLogFrame')));
// const GoodsCenterFrame = Loadable(lazy(() => import('pages/logpage/GoodsCenterFrame')));
// //计算中心
// const ComputeFrame = Loadable(lazy(() => import('pages/compute/ComputeFrame')));

const MainRoutes = {
    path: '/',
    element: <GFTHome />,
    children: [
        {
            path: '/',
            element: <GFTHomeView />,

        },
        {
            path: '/detail',
            element: <GFTNFTDetail />,

        },
        {
            path: '/create_project',
            element: <GFTCreateProject />,

        },
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
