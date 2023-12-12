import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import Button from '@mui/material/Button'


export const SignupButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/dashboard",
      },
      authorizationParams: {
        screen_hint: "signup",
      },
    });
  };

  return (
    <Button className="button__sign-up" onClick={handleSignUp} variant='outlined'>
      Sign Up
    </Button>
  );
};