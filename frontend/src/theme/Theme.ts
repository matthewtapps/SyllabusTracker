import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#fabd2f',
        },
        secondary: {
            main: '#689d6a',
        },
        background: {
            default: '#282828',
        },
        text: {
            primary: '#ebdbb2',
        },
        error: {
            main: '#cc241d',
        },
        warning: {
            main: '#d65d0e',
        },
        info: {
            main: '#458588',
        },
        success: {
            main: '#b8bb26',
        },
    },
});

export default theme;