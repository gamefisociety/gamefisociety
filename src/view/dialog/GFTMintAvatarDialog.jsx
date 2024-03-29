import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { useSelector, useDispatch } from 'react-redux';
import {
    setOpenMintAvatar
} from 'module/store/features/dialogSlice';
import './GFTMintAvatarDialog.scss';
import { BlueLoadButton } from '../utils/GFTStyleButton';
import CircularProgress from '@mui/material/CircularProgress';

import GSTAvatarNFTBase from '../../web3/GSTAvatarNFT';

const GFTMintAvatarDialog = () => {

    const { activate, account, chainId, active, library, deactivate } = useWeb3React();
    const { isOpenMintAvatar } = useSelector(s => s.dialog);
    const dispatch = useDispatch();
    const [isLoadSub, setIsLoadSub] = useState(false);
    const [checkState, setCheckState] = useState(0);
    useEffect(() => {
        getAvatarBalance();
        return () => {

        }
    }, [])

    const getAvatarBalance = () => {
        if (account) {
            GSTAvatarNFTBase.getTokenBalanceOf(library, account).then(res => {
                if (res > 0) {
                    setCheckState(3);
                }
            }).catch(err => {
                setCheckState(2);
                console.log(err, 'err');

            })
        } else {
            return 0;
        }
    }

    const cancelDialog = () => {
        dispatch(setOpenMintAvatar(false));
    }

    const mintAvatar = () => {
        if (checkState !== 0) {
            return;
        }
        if (account) {
            setIsLoadSub(true);
            GSTAvatarNFTBase.mintAvatar(library, account).then(res => {
                console.log(res, 'res');
                setCheckState(1);
                setIsLoadSub(false);
            }).catch(err => {
                setCheckState(2);
                setIsLoadSub(false);
                console.log(err, 'err');
            })
        } else {
            return 0;
        }
    }

    const mintNFTMsg = () => {
        if (checkState == 0) {
            return 'Mint'
        } else if (checkState == 1) {
            return "Got An Avatar NFT!"
        } else if (checkState == 2) {
            return "Something Wrong!"
        } else if (checkState == 3) {
            return "You already have an avatar!"
        }
    }

    return (
        <div className='dialog_check_in_bg' onClick={cancelDialog}>
            <div className='layout' onClick={(event) => {
                event.stopPropagation();
            }}>
                <div className='close' onClick={cancelDialog}></div>
                <div className='img_icon'></div>
                <span className='info'>
                    Welcome to the world of GameFi Society
                    <br />
                    <br />
                    Mint An Avatar NFT
                </span>
                <BlueLoadButton variant="contained" onClick={() => mintAvatar()} loading={isLoadSub} loadingIndicator={<CircularProgress color={"primary"} size={30} />}>
                    {mintNFTMsg()}
                </BlueLoadButton>
            </div>
        </div>
    );
}

export default React.memo(GFTMintAvatarDialog);