import { React, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { useSelector, useDispatch } from 'react-redux';
import {
    isCheckIn,
    setOpenCheckIn
} from '../../module/store/features/dialog/GFTDialogSlice';
import './GFTCheckInDialog.scss';
import { BlueLoadButton } from '../utils/GFTStyleButton';
import CircularProgress from '@mui/material/CircularProgress';

import GSTClaimBase from '../../web3/GSTClaim';




function GFTCheckInDialog() {

    const { activate, account, chainId, active, library, deactivate } = useWeb3React();
    const isOpen = useSelector(isCheckIn);
    const dispatch = useDispatch();
    const [isLoadSub, setIsLoadSub] = useState(false);
    const [checkState, setCheckState] = useState(0);
    useEffect(() => {
        requsetData();
        return () => {

        }

    }, [])

    const requsetData = () => {
        getIsClaimable();
    }
    const getIsClaimable = () => {
        console.log("getIsClaimable");
        if (account) {
            GSTClaimBase.isClaimable(library, account).then(res => {
                console.log(res,'res');
                if (res) {
                    setCheckState(2);
                } else {
                    setCheckState(1);
                }
            }).catch(err => {
                setCheckState(3);
                console.log(err, 'err');
            })
        } else {
            return 0;
        }
    }
    const cancelDialog = () => {
        dispatch(setOpenCheckIn(false));
    }

    const claimEveryDay = () => {
        if (account) {
            setIsLoadSub(true);
            GSTClaimBase.claimEveryDay(library, account).then(res => {
                console.log(res, 'res');
                setCheckState(1);
                setIsLoadSub(false);
            }).catch(err => {
                setIsLoadSub(false);
                console.log(err, 'err');
            })
        } else {
            return 0;
        }
    }

    const checkInClick = () => {
        if(checkState === 0){
            //nothing
        }else if(checkState === 1){
            cancelDialog();
        }else if(checkState === 2){
            claimEveryDay();
        }else if (checkState === 3) {
            requsetData();
        }
    }
    const getCheckIn = () => {
        if (checkState == 0) {
            return 'Loading'
        } else if (checkState == 1) {
            return "Completion Check In"
        } else if (checkState == 2) {
            return "Check In"
        } else if (checkState == 3) {
            return "loading error"
        }
    }

    return (

        <div>
            {isOpen ?
                <div className='dialog_check_in_bg' onClick={cancelDialog}>
                    <div className='layout' onClick={(event) => {
                        event.stopPropagation();
                    }}>
                        <div className='close' onClick={cancelDialog}></div>
                        <div className='img_icon'></div>
                        <span className='txt_gts'>1 GSP</span>
                        <span className='info'>
                            Welcome to the world of GameFi Society
                            <br />
                            <br />
                            Sign in and you will receive tokens from the platform
                        </span>
                        <BlueLoadButton variant="contained" onClick={() => checkInClick()} loading={isLoadSub}  loadingIndicator={<CircularProgress color={"primary"} size={30} />}>
                            {getCheckIn()}
                        </BlueLoadButton>
                    </div>
                </div>
                : ""
            }
        </div>
    );
}

export default GFTCheckInDialog;