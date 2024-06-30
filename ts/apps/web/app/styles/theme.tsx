"use client";
import { forwardRef } from 'react';

import { Atkinson_Hyperlegible } from 'next/font/google';
import NextLink from 'next/link';

import { Zoom } from '@mui/material';
import {
  purple,
  teal,
} from '@mui/material/colors';
// const getDesignTokens = (mode: PaletteMode) => ({
//     palette: {
//         mode,
//         ...(mode === 'light'
//             ? {
//                 // palette values for light mode
//                 primary: amber,
//                 divider: amber[200],
//                 text: {
//                     primary: grey[900],
//                     secondary: grey[800],
//                 },
//             }
//             : {
//                 // palette values for dark mode
//                 primary: deepOrange,
//                 divider: deepOrange[700],
//                 background: {
//                     default: deepOrange[900],
//                     paper: deepOrange[900],
//                 },
//                 text: {
//                     primary: '#fff',
//                     secondary: grey[500],
//                 },
//             }),
//     },
// });
import {
  createTheme,
  PaletteColor,
} from '@mui/material/styles';

const LinkBehaviour = forwardRef(function LinkBehaviour(props: any, ref: any) {
    return <NextLink ref={ref} {...props} />;
});

export const atkinson_hyperlegible = Atkinson_Hyperlegible({
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin', 'latin-ext']
});

const { palette } = createTheme();
export const theme = createTheme({
    typography: {
        fontFamily: atkinson_hyperlegible.style.fontFamily,
    },
    palette: {
        mode: "dark",
        purple: palette.augmentColor({ color: { main: '#8155BA' } }),
        lightBlue: palette.augmentColor({ color: { main: "#596f89" } }),
        gray: palette.augmentColor({ color: { main: "#505050" } }),
        white: {
            light: "#FFFFFF",
            main: "#FFFFFF",
            dark: "#FFFFFF",
            contrastText: "#000000",
        },
        info: palette.augmentColor({ color: { main: "#3282E0" } }),
        // #679097
        // #213052
        // #919798
        // #2c4991
        primary: {
            main: teal[600],
        },
        secondary: {
            main: purple["300"],
        },
        text: {
            primary: "#FFFFFF",
            secondary: "#999999",
        },
    },
    components: {
        MuiTooltip: {
            defaultProps: {
                enterDelay: 1000,
                TransitionComponent: Zoom,
                TransitionProps: {
                    timeout: 100
                }
            }
        },
        // Name of the component
        MuiTextField: {
            styleOverrides: {
                // Name of the slot
                root: {
                    // Some CSS
                    //   fontSize: '1rem',
                    color: "#dddddd",
                },
            },
            defaultProps: {
                autoComplete: 'off',
            }
        },
        MuiLink: {
            defaultProps: {
                //@ts-ignore
                component: LinkBehaviour,
            },
        },
        MuiButtonBase: {
            defaultProps: {
                LinkComponent: LinkBehaviour,
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                }
            }
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: "40px",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    padding: '10px'
                },
            },
        },
        MuiStepLabel: {
            styleOverrides: {
                alternativeLabel: {
                    marginTop: '1px'
                },
                label: {
                    marginTop: '1px'
                },
                labelContainer: {
                    marginTop: '1px'
                }
            },
        },
    },
});

declare module "@mui/material/styles" {
    interface Palette {
        purple: PaletteColor;
        lightBlue: PaletteColor;
        gray: PaletteColor;
        white: PaletteColor;
    }
    interface PaletteOptions {
        purple?: PaletteColor;
        lightBlue?: PaletteColor;
        gray?: PaletteColor;
        white?: PaletteColor;
    }
}

declare module "@mui/material/Button" {
    interface ButtonPropsColorOverrides {
        purple: true;
        lightBlue: true;
        gray: true;
        white: true;
    }
}

declare module "@mui/material/Chip" {
    interface ChipPropsColorOverrides {
        purple: true;
        lightBlue: true;
        gray: true;
        white: true;
    }
}

declare module "@mui/material/IconButton" {
    interface IconButtonPropsColorOverrides {
        purple: true;
        lightBlue: true;
        gray: true;
        white: true;
    }
}
