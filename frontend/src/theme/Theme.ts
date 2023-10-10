import { createTheme } from '@mui/material/styles'

const Theme = createTheme({
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
            }
    },
});

export default Theme
