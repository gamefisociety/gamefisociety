
export const ChainId = {
    BSC: 56,
    BSCTEST: 97,
    MATIC: 137,
    MATICTEST: 80001,
  }


const SCAN_ADDRESS = {
    [ChainId.BSC]: 'https://bscscan.com',
    [ChainId.BSCTEST]: 'https://testnet.bscscan.com/',
    [ChainId.MATIC]: 'https://polygonscan.com/',
    [ChainId.MATICTEST]: 'https://polygonscan.com/',
  }
  const networkConf = {
    [ChainId.BSCTEST]: {
      chainId: '0x61',
      chainName: 'BSC-TEST',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: [
        'https://data-seed-prebsc-1-s1.binance.org:8545/',
      ],
      blockExplorerUrls: [SCAN_ADDRESS[ChainId.BSCTEST]],
    },
    [ChainId.BSC]: {
      chainId: '0x38',
      chainName: 'BSC',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: ['https://bsc-dataseed.binance.org/'],
      blockExplorerUrls: [SCAN_ADDRESS[ChainId.BSC]],
    },
    [ChainId.MATIC]: {
      chainId: '0x89',
      chainName: 'MATIC',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: ['https://rpc-mainnet.maticvigil.com'],
      blockExplorerUrls: [SCAN_ADDRESS[ChainId.MATIC]],
    },
    [ChainId.MATICTEST]: {
      chainId: '0x13881',
      chainName: 'MATIC-TEST',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
      blockExplorerUrls: [SCAN_ADDRESS[ChainId.MATICTEST]],
    }
  }
  
 export const changeNetwork = chainId => {
    return new Promise(reslove => {
      const {ethereum} = window
      if (ethereum && ethereum.isMetaMask && networkConf[chainId]) {
        ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              ...networkConf[chainId]
            }
          ],
        }).then(() => {
          setTimeout(reslove, 1000)
        })
      } else {
        reslove()
      }
    })
  }