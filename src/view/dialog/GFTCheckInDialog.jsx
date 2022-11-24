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






function GFTCheckInDialog() {

    const { activate, account, chainId, active, library, deactivate } = useWeb3React();
    const isOpen = useSelector(isCheckIn);
    const dispatch = useDispatch();
    const [isLoadSub, setIsLoadSub] = useState(false);
    useEffect(() => {
        requsetData();
        return () => {

        }

    }, [])

    const requsetData = () => {

    }
    const cancelDialog = () => {
        dispatch(setOpenCheckIn(false));
    }

    const checkInClick = () => {
        setIsLoadSub(true);
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
                        <span className='txt_gts'>12.0453 GST</span>
                        <span className='info'>
                            Welcome to the world of GameFi Society
                            <br />
                            <br />
                            Sign in and you will receive tokens from the platform
                        </span>
                        <BlueLoadButton variant="contained" onClick={() => checkInClick()} loading={isLoadSub} loadingIndicator={<CircularProgress color={"primary"} size={30}/>}>
                            check in
                        </BlueLoadButton>
                    </div>
                </div>
                : ""
            }
        </div>
    );
}

export default GFTCheckInDialog;