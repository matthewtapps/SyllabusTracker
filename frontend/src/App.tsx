import React from 'react';
import { Route, Routes } from "react-router-dom";
import DashboardPage from './pages/navigation/DashboardPage';
import TechniquesPage from "./pages/navigation/TechniquesPage";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/Theme";
import CollectionsPage from './pages/navigation/CollectionsPage'
import BaseLayout from "./components/BaseLayout";
import { Role, Rank, Belt, Stripes } from 'common';
import { CallbackPage } from './pages/navigation/CallbackPage';
import Pageloader from './components/PageLoader';
import { useAuth0 } from "@auth0/auth0-react";
import { AuthenticationGuard } from './components/AuthenticationGuard';


interface User {
    userId: string,
    role: Role,
    username: string,
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    email: string,
    mobile: string,
    rank: Rank
}

function App() {

  const [user, setUser] = React.useState<User>({
    userId: '1',
    role: Role.Coach,
    username: 'Liam',
    firstName: 'Liam',
    lastName: 'Heaver',
    dateOfBirth: new Date(1963, 1, 24),
    email: 'example@example.com',
    mobile: '0400000000',
    rank: {belt: Belt.White, stripes: Stripes.Four}
  })

  const handleUserRoleChange = (role: Role) => {
    setUser((prevUser) => {
      const newUser = {
        ...prevUser,
        role: role
      }
      return newUser
    })
  }

  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="page-layout">
        <Pageloader />
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<BaseLayout onSetRole={handleUserRoleChange} text="Home" children={<div></div>}/>}/>
          <Route path="/dashboard" 
            element={<AuthenticationGuard render={() => <BaseLayout onSetRole={handleUserRoleChange} text="Home"><DashboardPage user={user}/></BaseLayout>}/>}
          />
          <Route path="/techniques" 
            element={<AuthenticationGuard render={() => <BaseLayout onSetRole={handleUserRoleChange} text="Techniques"><TechniquesPage user={user}/></BaseLayout>}/>}
          />
          <Route path="/collections" 
            element={<AuthenticationGuard render={() => <BaseLayout onSetRole={handleUserRoleChange} text="Collections"><CollectionsPage user={user}/></BaseLayout>}/>}
          />
          <Route path="/callback" element={<BaseLayout onSetRole={handleUserRoleChange} text="Home"><CallbackPage/></BaseLayout>}
          />
        </Routes>
    </ThemeProvider>
  );
}

export default App;
