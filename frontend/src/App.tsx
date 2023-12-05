import React from 'react';
import { Route, Routes } from "react-router-dom";
import DashboardPage from './pages/navigation/DashboardPage';
import TechniquesPage from "./pages/navigation/TechniquesPage";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/Theme";
import CollectionsPage from './pages/navigation/CollectionsPage'
import { CallbackPage } from './pages/navigation/CallbackPage';
import Pageloader from './components/PageLoader';
import { useAuth0 } from "@auth0/auth0-react";
import { AuthenticationGuard } from './components/AuthenticationGuard';
import { ProfilePage } from './pages/navigation/ProfilePage';


function App() {

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
          <Route path="/" 
            element={<AuthenticationGuard component={DashboardPage}/>}
          />
          <Route path="/techniques" 
            element={<AuthenticationGuard component={TechniquesPage}/>}
          />
          <Route path="/collections" 
            element={<AuthenticationGuard component={CollectionsPage}/>}
          />
          <Route path="/profile" 
            element={<AuthenticationGuard component={ProfilePage}/>}
          />
          <Route path="/callback" element={<CallbackPage/>}
          />
        </Routes>
    </ThemeProvider>
  );
}

export default App;
