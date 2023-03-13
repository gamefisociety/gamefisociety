import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
// material-ui
import {
    CssBaseline,
    StyledEngineProvider,
    Divider
} from '@mui/material';
import {
    experimental_extendTheme as extendTheme,
    Experimental_CssVarsProvider as CssVarsProvider,
} from '@mui/material/styles';

// import {
//     Experimental_CssVarsProvider as CssVarsProvider,
//     experimental_extendTheme as extendTheme,
// } from '@mui/material/styles';

//   const theme = extendTheme();
//   // ...custom theme

//   function App() {
//     return <CssVarsProvider theme={theme}>...</CssVarsProvider>;
//   }


// project import
import Palette from './palette';
import Typography from './typography';
import CustomShadows from './shadows';
import componentsOverride from './overrides';

// ==============================|| DEFAULT THEME - MAIN  ||============================== //
export default function ThemeCustomization({ children }) {
    const theme_light = Palette('light');
    const theme_dark = Palette('dark');
    const themeTypography = Typography(`'Saira-Medium', Saira`);
    // const themeCustomShadows = useMemo(() => CustomShadows(theme_dark), [theme_dark]);

    const themeOptions = useMemo(
        () => ({
            colorSchemes: {
                light: theme_light,
                dark: theme_dark,
            },
            breakpoints: {
                values: {
                    xs: 0,
                    sm: 768,
                    md: 1024,
                    lg: 1266,
                    xl: 1536
                }
            },
            direction: 'ltr',
            mixins: {
                toolbar: {
                    minHeight: 60,
                    paddingTop: 8,
                    paddingBottom: 8
                }
            },
            // customShadows: themeCustomShadows,
            typography: themeTypography
        }),
        [theme_dark, theme_light, themeTypography]
    );

    const themes = extendTheme(themeOptions);

    themes.components = componentsOverride(themes);

    // delete themes.colorSchemes.light;
    // console.log
    // console.log('themes', themes);
    // const themes = extendTheme(themeOptions);
    // const [mode, setMode] = useState(() => {
    //     if (typeof window !== 'undefined') {
    //         return localStorage.getItem('mode') ?? 'light';
    //     }
    //     return 'light';
    // });

    return (
        <StyledEngineProvider injectFirst>
            <CssVarsProvider theme={themes} defaultMode="dark" enableColorScheme={true}>
                <CssBaseline />
                {children}
            </CssVarsProvider>
        </StyledEngineProvider>
    );
}

ThemeCustomization.propTypes = {
    children: PropTypes.node
};
