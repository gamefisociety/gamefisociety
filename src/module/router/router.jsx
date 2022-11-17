import React from "react";
import { useRoutes } from "react-router-dom";
import GFTHome  from "../../view/home/GFTHome";


export default function Router() {
  let element = useRoutes([
    {
      path: '/',
      element: <GFTHome />,
      // children:[
      //   {
          
      //   },
      // ]
    },
   
  ]);

  return element;
}
