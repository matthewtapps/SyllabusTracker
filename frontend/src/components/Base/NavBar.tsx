import React from 'react'
import { AppBar, Toolbar, IconButton, Typography, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import AuthButtons from '../Authentication/AuthButtons';


interface NavBarProps {
    text: string;
}

const NavBar = (props: NavBarProps) => {

    const [open, setOpen] = React.useState(false)

    const handleClickOpen = () => {
        setOpen(true);
    }
    
    const handleClose = () => {
        setOpen(false)
    }

    return (
        <React.Fragment>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={handleClickOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {props.text}
                    </Typography>
                    <AuthButtons/>
                </Toolbar>
            </AppBar>
            <Drawer open={open} onClose={handleClose} aria-describedby="alert-dialog-slide-description">
                <DialogTitle>User Role Settings</DialogTitle>
                <DialogContent>
                    <DialogContentText>Set current user role</DialogContentText>
                </DialogContent>
                <DialogActions>
                </DialogActions>
            </Drawer>
        </React.Fragment>
    );
};

export default NavBar
