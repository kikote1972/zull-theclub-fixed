import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';
import AccessPage from './components/AccessPage';
import ScannerPage from './components/ScannerPage';
import StaffPage from './components/StaffPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/access" element={<AccessPage />} />
        <Route path="/scanner" element={<ScannerPage />} />
        <Route path="/staff" element={<StaffPage />} />
      </Routes>
    </Router>
  );
}

export default App;
