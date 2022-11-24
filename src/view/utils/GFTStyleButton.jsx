import { alpha, styled } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';

export const BlueLoadButton = styled(LoadingButton)`
    margin-top:38px;
    width: 352px;
    height: 48px;
    background: #006CF9;
    border-radius: 5px;
    border-radius: 0.09rem;
    font-size: 16px;
    font-family: Saira;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 25px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    &:hover{
        background: #006CF9;
    }
    &.Mui-disabled {
        color: #00000000;
        box-shadow: none;
        background: #00000000;
    }
`;