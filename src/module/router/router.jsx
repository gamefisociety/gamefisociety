import React from "react";
import { useRoutes} from "react-router-dom";
import GFTHomeView from "../../view/home/GFTHomeView";
import GFTHome from "../../view/home/GFTHome";
import GFTNFTDetail from "../../view/home/GFTNFTDetail";
import GFTCreateProject from "../../view/home/GFTCreateProject";

export default function Router() {
  let element = useRoutes([
    {
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
    },


  ]);

  return element;
}
