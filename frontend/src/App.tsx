import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from './pages/navigation/LoginPage';
import HomePage from './pages/navigation/HomePage';
import NewTechniquePage from "./pages/users/coach/NewTechnique";
import TechniquesPage from "./pages/navigation/TechniquesPage";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/Theme";
import NewCollectionPage from "./pages/navigation/NewCollectionPage";
import CollectionsPage from './pages/navigation/CollectionsPage'
import BaseLayout from "./components/BaseLayout";
import { Role, Rank, Belt, Stripes } from 'common';

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
    role: Role.Student,
    username: 'Liam',
    firstName: 'Liam',
    lastName: 'Heaver',
    dateOfBirth: new Date(1963, 1, 24),
    email: 'example@example.com',
    mobile: '0400000000',
    rank: {belt: Belt.White, stripes: Stripes.Four}
  })

  const handleUserRoleChange = (role: Role) => {
    setUser({userId: '1',
    role: role,
    username: 'Liam',
    firstName: 'Liam',
    lastName: 'Heaver',
    dateOfBirth: new Date(1963, 1, 24),
    email: 'example@example.com',
    mobile: '0400000000',
    rank: {belt: Belt.White, stripes: Stripes.Four}
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/" element={<BaseLayout onSetRole={handleUserRoleChange} text="Home"><HomePage user={user}/></BaseLayout>} />
          <Route path="/newtechnique" element={<BaseLayout onSetRole={handleUserRoleChange} text="New Technique"><NewTechniquePage/></BaseLayout>} />
          <Route path="/techniques" element={<BaseLayout onSetRole={handleUserRoleChange} text="Techniques"><TechniquesPage user={user}/></BaseLayout>} />
          <Route path="/collections" element={<BaseLayout onSetRole={handleUserRoleChange} text="Collections"><CollectionsPage user={user}/></BaseLayout>} />
          <Route path="/newcollection" element={<BaseLayout onSetRole={handleUserRoleChange} text="New Collection"><NewCollectionPage user={user}/></BaseLayout>}/>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
