import React from 'react'
import { AppBar, Toolbar, IconButton, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Drawer } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { Role } from 'common'

interface NavBarProps {
    text: string;
    onSetRole: (role: Role) => void;
}

const NavBar = (props: NavBarProps) => {

    const [open, setOpen] = React.useState(false)

    const handleClickOpen = () => {
        setOpen(true);
    }
    
    const handleClose = () => {
        setOpen(false)
    }

    const handleSetRole = (role: Role) => () => {
        props.onSetRole(role);
        handleClose();
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
                </Toolbar>
            </AppBar>
            <Drawer open={open} onClose={handleClose} aria-describedby="alert-dialog-slide-description">
                <DialogTitle>User Role Settings</DialogTitle>
                <DialogContent>
                    <DialogContentText>Set current user role</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSetRole(Role.Student)}>Student</Button>
                    <Button onClick={handleSetRole(Role.Coach)}>Coach</Button>
                    <Button onClick={handleSetRole(Role.Admin)}>Admin</Button>
                </DialogActions>
            </Drawer>
        </React.Fragment>
    );
};

export default NavBar
