import React from 'react';
import NavBar from './NavBar';

interface BaseLayoutProps {
    children: React.ReactNode;
    text: string;
}

const BaseLayout: React.FC<BaseLayoutProps> = (props) => {
    return (
      <div>
        <NavBar 
        text={props.text} />
        <div>{props.children}</div>
      </div>
    );
  }

export default BaseLayout;
