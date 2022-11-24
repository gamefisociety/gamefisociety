
import { HashRouter } from "react-router-dom";
import { Web3ReactProvider } from '@web3-react/core'
import Router from './module/router/router'
import Web3 from 'web3'
import './App.css';

import GFTConnectDialog from "./view/dialog/GFTConnectDialog";
import GFTWalletMenu from "./view/menu/GFTWalletMenu";
function getLibrary(provider, connector) {
  const web3 = new Web3(provider);
  return web3 // this will vary according to whether you use e.g. ethers or web3.js
}


function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="App">
        <HashRouter>
          <Router />
        </HashRouter>
        <GFTConnectDialog/>
        <GFTWalletMenu/>
      </div>
    </Web3ReactProvider>
  );
}

export default App;
