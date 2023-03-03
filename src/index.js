import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './module/store';
import { Web3ReactProvider } from '@web3-react/core'
import { SnackbarProvider } from "notistack";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Web3 from 'web3'

function getLibrary(provider, connector) {
  const web3 = new Web3(provider);
  return web3
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <SnackbarProvider maxSnack={3}>
        <Provider store={store}>
          <App />
        </Provider>
      </SnackbarProvider>
    </Web3ReactProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
