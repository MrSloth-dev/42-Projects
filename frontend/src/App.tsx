import { Routes, Route } from 'react-router-dom';
import ProjectsDashboard from './components/ProjectsDashboard';
import LandingPage from './components/LandingPage';
import OAuthCallback from './components/OAuthCallback';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<ProjectsDashboard />} />
        <Route path="/api/auth/callback" element={<OAuthCallback />} />
      </Routes>
    </div>
  );
}

export default App;
