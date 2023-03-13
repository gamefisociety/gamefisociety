// material-ui
import { createTheme } from '@mui/material/styles';
import { presetPalettes } from '@ant-design/colors';
import ThemeOption from './theme';

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

const Palette = (mode) => {
    const colors = presetPalettes;

    const greyPrimary = [
        '#ffffff',
        '#fafafa',
        '#f5f5f5',
        '#f0f0f0',
        '#d9d9d9',
        '#bfbfbf',
        '#8c8c8c',
        '#595959',
        '#262626',
        '#141414',
        '#000000'
    ];
    const greyAscent = ['#fafafa', '#bfbfbf', '#434343', '#1f1f1f'];
    const greyConstant = ['#fafafb', '#e6ebf1'];

    colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

    const paletteColor = ThemeOption(colors);

    return {
        palette: {
            mode,
            common: {
                black: '#000',
                white: '#fff'
            },
            ...paletteColor,
            text: {
                primary: mode === 'dark' ? '#FFFFFF' : '#000',
                secondary: mode === 'dark' ? '#919191' : paletteColor.grey[700],
                disabled: mode === 'dark' ? '#666666' : paletteColor.grey[400]
            },
            action: {
                disabled: paletteColor.grey[300]
            },
            divider: mode === 'dark' ? paletteColor.grey[0] : paletteColor.grey[900],
            background: {
                paper: mode === 'dark' ? '#0F0F0F' : '#FFFFFF',
                default: mode === 'dark' ? '#202122' : '#FFFFFF',
            },
        }
    };
};

export default Palette;
