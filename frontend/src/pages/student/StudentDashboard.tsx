import { User } from "common"
import { AppBar, Box, Toolbar, IconButton, Typography } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"

function studentDashboard(user: User): React.ReactNode {
    return (
    <div>
        <Box sx={{ flexGrow: 1 }}>
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
                    Student Dashboard
                </Typography>
                </Toolbar>
            </AppBar>
        </Box>


        <p>Hello Student!</p>
        <p>Dashboard goes here</p>
        <p>{user.firstName}
        {user.lastName}
        {user.email}
        {user.role}
        {user.userId}</p>
    </div>
)
}

export  { studentDashboard }