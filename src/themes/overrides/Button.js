// ==============================|| OVERRIDES - BUTTON ||============================== //

export const Button = (themes) => {
    // console.log('Button', themes);
    // const disabledStyle = {
    //     '&.Mui-disabled': {
    //         backgroundColor: themes.palette.grey[200]
    //     }
    // };

    return {
        MuiButton: {
            defaultProps: {
                disableElevation: true
            },
            styleOverrides: {
                root: {
                    fontWeight: 400
                },
                contained: ({ theme }) => ({
                    color: theme.vars.palette.grey[200]
                }),
                outlined: ({ theme }) => ({
                    color: theme.vars.palette.grey[200]
                })
            }
        }
    };
}

export default Button;
