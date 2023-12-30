import React from 'react';
import { Route, Routes } from "react-router-dom";
import DashboardPage from './pages/navigation/DashboardPage';
import TechniquesPage from "./pages/navigation/TechniquesPage";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/Theme";
import CollectionsPage from './pages/navigation/CollectionsPage'
import { CallbackPage } from './pages/navigation/CallbackPage';
import Pageloader from './components/Base/PageLoader';
import { useAuth0 } from "@auth0/auth0-react";
import { AuthenticationGuard } from './components/Authentication/AuthenticationGuard';
import { ProfilePage } from './pages/navigation/ProfilePage';
import StudentsPage from './pages/navigation/StudentsPage';
import { StudentProvider } from './components/Contexts/SelectedStudentContext';
import SelectedStudentDashboardPage from './pages/navigation/SelectedStudentDashboardPage';
import SelectedStudentTechniquesPage from './pages/navigation/SelectedStudentTechniquesPage';


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
      <StudentProvider>
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
          <Route path="/students"
            element={<AuthenticationGuard component={StudentsPage}/>}
          />
          <Route path="/student"
            element={<AuthenticationGuard component={SelectedStudentDashboardPage}/>}
          />
          <Route path="/student/techniques"
            element={<AuthenticationGuard component={SelectedStudentTechniquesPage}/>}
          />
        </Routes>
      </StudentProvider>
    </ThemeProvider>
  );
}

export default App;
