import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        primary: {
            light: '#928374',
            main: '#282828',
            dark: '#1d2021',
            contrastText: '#ebdbb2',
        },
        secondary: {
            light: '#f9f5d7',
            main: '#fbf1c7',
            dark: '#928374',
            contrastText: '#3c3836',
        },
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#928374',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#fbf1c7',
                    }
                },
                notchedOutline: {
                    borderColor: '#928374',
                },
                input: {
                    color: '#fbf1c7'
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#fbf1c7',
                    '&.Mui-focused': {
                        color: '#282828',
                    }
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                containedPrimary: {
                    backgroundColor: '#282828',
                    '&:hover': {
                        backgroundColor: '#1d2021',
                    }
                }
            }
        }
    }
});

export default theme;