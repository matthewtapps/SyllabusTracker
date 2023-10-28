import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from './pages/navigation/LoginPage';
import HomePage from './pages/navigation/HomePage';
import NewTechniquePage from "./pages/users/coach/NewTechnique";
import TechniquesPage from "./pages/navigation/TechniquesPage";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/Theme";
import NewCollectionPage from "./pages/navigation/NewCollectionPage";
import BaseLayout from "./components/BaseLayout";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/" element={<BaseLayout text="Home"><HomePage/></BaseLayout>} />
          <Route path="/newtechnique" element={<BaseLayout text="New Technique"><NewTechniquePage/></BaseLayout>} />
          <Route path="/techniques" element={<BaseLayout text="Techniques"><TechniquesPage/></BaseLayout>} />
          <Route path="/newcollection" element={<BaseLayout text="New Collection"><NewCollectionPage/></BaseLayout>}/>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
