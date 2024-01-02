import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import Button from '@mui/material/Button'


export const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <Button className="button__logout" onClick={handleLogout} variant='outlined'>
      LogOut
    </Button>
  );
};