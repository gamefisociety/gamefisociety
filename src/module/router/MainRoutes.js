import { lazy } from "react";

// project import
import Loadable from "components/Loadable";
import MainLayout from "view/layout/MainLayout";

const GFTHomeView = Loadable(lazy(() => import("view/home/GFTHomeView")));
const GFTHomeMeta = Loadable(lazy(() => import('view/home/GFTHomeMeta')));
const GGamePage = Loadable(lazy(() => import("view/page/GGamePage")));
const GNewsPage = Loadable(lazy(() => import("view/page/GNewsPage")));
const GVideoPage = Loadable(lazy(() => import("view/page/GVideoPage")));
const GFTNFTDetail = Loadable(lazy(() => import("view/home/GFTNFTDetail")));
const GFTCreateProject = Loadable(
  lazy(() => import("view/home/GFTCreateProject"))
);
const GFTMintNFT = Loadable(lazy(() => import("view/home/GFTMintNFT")));
const GHall = Loadable(lazy(() => import("view/page/GHall")));
const GUserHome = Loadable(lazy(() => import("view/page/GUserHome")));
const GProfile = Loadable(lazy(() => import("view/page/GProfile")));
const GSetting = Loadable(lazy(() => import("view/page/GSetting")));
const GFTGlobal = Loadable(lazy(() => import("view/page/GFTGlobal")));
const GPostReplay = Loadable(lazy(() => import("view/page/GPostReplay")));
const GArticleList = Loadable(lazy(() => import("view/page/GArticleList")));
const GGroupChat = Loadable(lazy(() => import("view/page/GGroupChat")));
const GNoteThread = Loadable(lazy(() => import("view/page/GNoteThread")));
const GFTWallet = Loadable(lazy(() => import("view/page/GFTWallet")));
const GArticle = Loadable(lazy(() => import("view/page/GArticle")));

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/",
      element: <GFTHomeMeta />,
    },
    {
      path: "/home",
      element: <GFTHomeView />,
    },
    {
        path: '/meta',
        element: <GFTHomeMeta />,
    },
    {
      path: "/detail",
      element: <GFTNFTDetail />,
    },
    {
      path: "/create_project",
      element: <GFTCreateProject />,
    },
    {
      path: "/hall",
      element: <GHall />,
    },
    {
      path: "/global",
      element: <GFTGlobal />,
    },
    {
      path: "/post-replay",
      element: <GPostReplay />,
    },
    {
      path: "/gamepage",
      element: <GGamePage />,
    },
    {
      path: "/newspage",
      element: <GNewsPage />,
    },
    {
      path: "/videopage",
      element: <GVideoPage />,
    },
    // {
    //     path: '/mint',
    //     element: <GFTMintNFT />,
    // },
    {
      path: "/userhome",
      element: <GUserHome />,
    },
    {
      path: "/profile",
      element: <GProfile />,
    },
    {
      path: "/setting",
      element: <GSetting />,
    },
    {
      path: "/articles",
      element: <GArticleList />,
    },
    {
      path: "/article",
      element: <GArticle />,
    },
    {
      path: "/groupchat",
      element: <GGroupChat />,
    },
    {
      path: "/notethread",
      element: <GNoteThread />,
    },
    {
      path: "/wallet",
      element: <GFTWallet />,
    },
  ],
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
