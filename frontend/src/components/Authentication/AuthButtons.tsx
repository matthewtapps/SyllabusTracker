import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { LoginButton } from "../LoginButton";
import { SignupButton } from "../SignUpButton";
import { LogoutButton } from "../LogoutButton";


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
