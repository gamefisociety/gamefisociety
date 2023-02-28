import { useRoutes } from "react-router-dom";
import MainRoutes from './MainRoutes';
import MiniRoutes from './MiniRoutes';

// ==============================|| ROUTING RENDER ||============================== //
export default function Router() {
  return useRoutes([MainRoutes, MiniRoutes]);
}