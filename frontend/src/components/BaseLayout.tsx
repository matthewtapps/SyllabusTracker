import React from 'react';
import NavBar from './NavBar';

interface BaseLayoutProps {
    children: React.ReactNode;
    text: string;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children, text }) => {
    return (
      <div>
        <NavBar text={text} />
        <div>{children}</div>
      </div>
    );
  }

export default BaseLayout;
