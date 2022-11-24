import MenuItemUnstyled, {
    menuItemUnstyledClasses,
} from '@mui/base/MenuItemUnstyled';
import PopperUnstyled from '@mui/base/PopperUnstyled';
import { styled } from '@mui/system';

export const StyledListbox = styled('ul')(
    ({ theme }) => `
    box-sizing: border-box;
    padding: 0px;
    margin: 8px 0;
    min-width: 164px;
    border-radius: 12px;
    overflow: auto;
    outline: 0px;
    background: #2E3035;
    `,
);

export const StyledMenuItem = styled(MenuItemUnstyled)(
    ({ theme }) => `
    list-style: none;
    height:48px;
    padding-left:14px;
    border-radius: 8px;
    cursor: default;
    user-select: none;
    font-size: 16px;
    font-family: Saira;
    font-weight: 500;
    color: #909090;
    border-bottom: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    &:last-of-type {
      border-bottom: none;
    }
  
    &.${menuItemUnstyledClasses.focusVisible} {
        outline: 0px solid #00000000;
        background: #00000000;
    }
  
    &.${menuItemUnstyledClasses.disabled} {
        background: #00000000;
    }
  
    &:hover:not(.${menuItemUnstyledClasses.disabled}) {
        background: #27282C;
    }
    `,
);

export const Popper = styled(PopperUnstyled)`
    z-index: 1;
  `;
