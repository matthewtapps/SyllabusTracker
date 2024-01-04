import { useAuth0 } from "@auth0/auth0-react";
import { ThemeProvider } from "@mui/material/styles";
import { Route, Routes } from "react-router-dom";
import { AuthenticationGuard } from './components/Authentication/AuthenticationGuard';
import Pageloader from './components/Base/PageLoader';
import { CallbackPage } from './pages/navigation/CallbackPage';
import CollectionsPage from './pages/navigation/CollectionsPage';
import DashboardPage from './pages/navigation/DashboardPage';
import { ProfilePage } from './pages/navigation/ProfilePage';
import SelectedStudentDashboardPage from './pages/navigation/SelectedStudentDashboardPage';
import SelectedStudentTechniquesPage from './pages/navigation/SelectedStudentTechniquesPage';
import StudentsPage from './pages/navigation/StudentsPage';
import TechniquesPage from "./pages/navigation/TechniquesPage";
import theme from "./theme/Theme";
import SelectedStudentCollectionsPage from "./pages/navigation/SelectedStudentCollectionsPage";


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
                    element={<AuthenticationGuard component={DashboardPage} />}
                />
                <Route path="/techniques"
                    element={<AuthenticationGuard component={TechniquesPage} />}
                />
                <Route path="/collections"
                    element={<AuthenticationGuard component={CollectionsPage} />}
                />
                <Route path="/profile"
                    element={<AuthenticationGuard component={ProfilePage} />}
                />
                <Route path="/callback" element={<CallbackPage />}
                />
                <Route path="/students"
                    element={<AuthenticationGuard component={StudentsPage} />}
                />
                <Route path="/student"
                    element={<AuthenticationGuard component={SelectedStudentDashboardPage} />}
                />
                <Route path="/student/techniques"
                    element={<AuthenticationGuard component={SelectedStudentTechniquesPage} />}
                />
                <Route path="/student/collections"
                    element={<AuthenticationGuard component={SelectedStudentCollectionsPage} />}
                />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
