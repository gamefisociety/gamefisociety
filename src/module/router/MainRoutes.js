import { lazy } from "react";

// project import
import Loadable from "components/Loadable";
import MainLayout from "view/layout/MainLayout";
import KeepAlive from "react-activation";
const GFTHomeView = Loadable(lazy(() => import("view/home/GFTHomeView")));
const GProjects = Loadable(lazy(() => import("view/page/GProjects")));
const GNewsPage = Loadable(lazy(() => import("view/page/GNewsPage")));
const GVideoPage = Loadable(lazy(() => import("view/page/GVideoPage")));
// const GFTNFTDetail = Loadable(lazy(() => import("view/home/GFTNFTDetail")));
const GFTMintNFT = Loadable(lazy(() => import("view/home/GFTMintNFT")));
const GHall = Loadable(lazy(() => import("view/page/GHall")));
const GUserHome = Loadable(lazy(() => import("view/page/GUserHome")));
const GProfile = Loadable(lazy(() => import("view/page/GProfile")));
const GSetting = Loadable(lazy(() => import("view/page/GSetting")));
const GFTGlobal = Loadable(lazy(() => import("view/page/GFTGlobal")));
const GPostReply = Loadable(lazy(() => import("view/page/GPostReply")));
const GArticles = Loadable(lazy(() => import("view/page/GArticles")));
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
    },
    {
      path: "/home",
      element: <GFTHomeView />,
    },
    {
      path: "/hall",
      element: <GHall />,
    },
    {
      path: "/global/:label",
      element: (
        <KeepAlive
          cacheKey="GlobalCache_ID"
          name="GlobalCache"
          when={() => true}
        >
          <GFTGlobal />
        </KeepAlive>
      ),
      // element: <GFTGlobal />,
    },
    {
      path: "/post-reply",
      element: <KeepAlive
      cacheKey="PostReplyCache_ID"
      name="PostReplyCache"
      when={() => true}
    >
      <GPostReply />
    </KeepAlive>,
      
    },
    {
      path: "/game",
      element: (
        <KeepAlive
          cacheKey="ProjectsCache_ID"
          name="ProjectsCache"
          when={() => true}
        >
          <GProjects />
        </KeepAlive>
      ),
    },
    {
      path: "/game/:gamename",
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
      path: "/userhome/:pubkey",
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
      path: "/article",
      element: (
        <KeepAlive
          cacheKey="ArticlesCache_ID"
          name="ArticlesCache"
          when={() => true}
        >
          <GArticles />
        </KeepAlive>
      ),
    },
    {
      path: "/article/:cid",
      element: <GDetailArticle />,
    },
    {
      path: "/notethread/:noteid",
      element: <GNoteThread />,
    },
    {
      path: "/wallet",
      element: <GFTWallet />,
    },
  ],
};

export default MainRoutes;
