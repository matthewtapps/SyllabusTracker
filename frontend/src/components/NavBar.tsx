import { AppBar, Toolbar, IconButton, Typography } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"

const NavBar = (props: any) => {
    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {props.text}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar
