import React from 'react';
import NavBar from './NavBar';
import { Box } from '@mui/material';

interface BaseLayoutProps {
    children: React.ReactNode;
    text: string;
}

const BaseLayout: React.FC<BaseLayoutProps> = (props) => {
    return (
      <div>
        <NavBar 
        text={props.text} />
        <Box sx={{paddingTop: "60px"}}>{props.children}</Box>
      </div>
    );
  }

export default BaseLayout;
