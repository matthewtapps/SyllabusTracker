import { withAuthenticationRequired } from "@auth0/auth0-react";
import React, { ComponentType } from "react";
import Pageloader from "../Base/PageLoader";


interface AuthenticationGuardProps {
  component: ComponentType;
}

export const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({
  component,
}) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div className="page-layout">
        <Pageloader />
      </div>
    ),
  });

  return <Component />;
};