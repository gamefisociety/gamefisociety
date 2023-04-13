import { useRoutes } from "react-router-dom";
import MainRoutes from './MainRoutes';
import MiniRoutes from './MiniRoutes';
import StoreRoutes from './StoreRoutes';
import MetaRoutes from './MetaRoutes';

// ==============================|| ROUTING RENDER ||============================== //
export default function Router() {
  return useRoutes([MainRoutes, MetaRoutes, MiniRoutes, StoreRoutes]);
}