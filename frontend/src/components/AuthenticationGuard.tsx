import { withAuthenticationRequired } from "@auth0/auth0-react";
import React, { ReactElement } from "react";
import Pageloader from "./PageLoader";

interface AuthenticationGuardProps {
  render: () => ReactElement;
}

export const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({ render }) => {
  const ComponentWithAuth = withAuthenticationRequired(render, {
    onRedirecting: () => (
      <div className="page-layout">
        <Pageloader />
      </div>
    ),
  });

  return <ComponentWithAuth />;
};
