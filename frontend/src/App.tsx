import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import './css/main.css'
import './css/login.css'
import NewTechniquePage from "./pages/NewTechniquePage";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/Theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" Component={LoginPage} />
          <Route path="/" Component={HomePage} />
          <Route path="/newtechnique" Component={NewTechniquePage} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
