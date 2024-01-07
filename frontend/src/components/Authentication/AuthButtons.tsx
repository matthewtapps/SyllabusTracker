import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { LoginButton } from "../Buttons/LoginButton";
import { SignupButton } from "../Buttons/SignUpButton";
import { LogoutButton } from "../Buttons/LogoutButton";


const AuthButtons = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="nav-bar__buttons">
      {!isAuthenticated && (
        <>
          <SignupButton />
          <LoginButton />
        </>
      )}
      {isAuthenticated && (
        <>
          <LogoutButton />
        </>
      )}
    </div>
  );
};

export default AuthButtons
