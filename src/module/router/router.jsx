import React from "react";
import { useRoutes} from "react-router-dom";
import GFTHomeView from "../../view/home/GFTHomeView";
import GFTHome from "../../view/home/GFTHome";
import GFTNFTDetail from "../../view/home/GFTNFTDetail";



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
      ]
    },


  ]);

  return element;
}
