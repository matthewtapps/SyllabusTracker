import React from 'react';
import NavBar from './NavBar';
import { Role } from 'common';

interface BaseLayoutProps {
    children: React.ReactNode;
    text: string;
    onSetRole: (role: Role) => void;
}

const BaseLayout: React.FC<BaseLayoutProps> = (props) => {
    return (
      <div>
        <NavBar 
        onSetRole={props.onSetRole} 
        text={props.text} />
        <div>{props.children}</div>
      </div>
    );
  }

export default BaseLayout;
