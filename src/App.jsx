
import { HashRouter } from "react-router-dom";
import { Web3ReactProvider } from '@web3-react/core'
import Router from './module/router/router'
import Web3 from 'web3'
import { useSelector, useDispatch } from 'react-redux';
import GFTConnectDialog from "./view/dialog/GFTConnectDialog";
import GFTWalletMenu from "./view/menu/GFTWalletMenu";
import GFTCheckInDialog from "./view/dialog/GFTCheckInDialog";
import {
  setIsOpenWallet,
  isMenuWallet
} from './module/store/features/dialog/GFTDialogSlice';
import './App.css';
function getLibrary(provider, connector) {
  const web3 = new Web3(provider);
  return web3 // this will vary according to whether you use e.g. ethers or web3.js
}


function App() {
  const isOpenMenu = useSelector(isMenuWallet);
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="App">
        <HashRouter>
          <Router />
        </HashRouter>
        {
          isOpenMenu?<GFTWalletMenu/>:""
        }
        <GFTConnectDialog/>
        <GFTCheckInDialog/>
        
      </div>
    </Web3ReactProvider>
  );
}

export default App;
