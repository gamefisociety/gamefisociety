import { lazy } from "react";

// project import
import Loadable from "components/Loadable";
import MainLayout from "view/layout/MainLayout";

const GFTHomeView = Loadable(lazy(() => import("view/home/GFTHomeView")));
const GFTHomeMeta = Loadable(lazy(() => import('view/meta/GFTHomeMeta')));
const GProjects = Loadable(lazy(() => import("view/page/GProjects")));
const GNewsPage = Loadable(lazy(() => import("view/page/GNewsPage")));
const GVideoPage = Loadable(lazy(() => import("view/page/GVideoPage")));
// const GFTNFTDetail = Loadable(lazy(() => import("view/home/GFTNFTDetail")));
const GFTCreateProject = Loadable(
  lazy(() => import("view/home/GFTCreateProject"))
);
const GFTMintNFT = Loadable(lazy(() => import("view/home/GFTMintNFT")));
const GHall = Loadable(lazy(() => import("view/page/GHall")));
const GUserHome = Loadable(lazy(() => import("view/page/GUserHome")));
const GProfile = Loadable(lazy(() => import("view/page/GProfile")));
const GSetting = Loadable(lazy(() => import("view/page/GSetting")));
const GFTGlobal = Loadable(lazy(() => import("view/page/GFTGlobal")));
const GPostReply = Loadable(lazy(() => import("view/page/GPostReply")));
const GArticles = Loadable(lazy(() => import("view/page/GArticles")));
const GGroupChat = Loadable(lazy(() => import("view/page/GGroupChat")));
const GNoteThread = Loadable(lazy(() => import("view/page/GNoteThread")));
const GFTWallet = Loadable(lazy(() => import("view/page/GFTWallet")));
const GDetailArticle = Loadable(lazy(() => import("view/page/GDetailArticle")));
const GDetailProject = Loadable(lazy(() => import("view/page/GDetailProject")));

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/",
      element: <GFTGlobal />,
    },
    {
      path: "/home",
      element: <GFTHomeView />,
    },
    {
        path: '/meta',
        element: <GFTHomeMeta />,
    },
    // {
    //   path: "/detail",
    //   element: <GFTNFTDetail />,
    // },
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
      path: "/post-reply",
      element: <GPostReply />,
    },
    {
      path: "/projects",
      element: <GProjects />,
    },
    {
      path: "/detailproject",
      element: <GDetailProject />,
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
      element: <GArticles />,
    },
    {
      path: "/detailarticle",
      element: <GDetailArticle />,
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

export default MainRoutes;
