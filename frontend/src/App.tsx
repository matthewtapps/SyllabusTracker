import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import './css/main.css'
import './css/login.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" Component={LoginPage} />
        <Route path="/" Component={HomePage} />
      </Routes>
    </Router>
  );
}

export default App;
