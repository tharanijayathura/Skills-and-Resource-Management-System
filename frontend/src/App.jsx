import { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './components/Dashboard.jsx';
import Personnel from './components/Personnel.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import Matching from './components/Matching.jsx';
import Search from './components/Search.jsx';
import Utilization from './components/Utilization.jsx';
import { ToastContainer } from './components/Toast.jsx';
import HowToWork from './HowToWork.jsx';

export default function App() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts([...toasts, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(toasts.filter(t => t.id !== id));
  };

  // Make showToast available globally via context or prop drilling
  window.showToast = showToast;

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <h1>Skills & Resource Management</h1>
        </div>
        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/personnel">Personnel</NavLink>
          <NavLink to="/skills">Skills</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/matching">Matching</NavLink>
          <NavLink to="/search">Search</NavLink>
          <NavLink to="/utilization">Utilization</NavLink>
        </nav>
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/personnel" element={<Personnel showToast={showToast} />} />
          <Route path="/skills" element={<Skills showToast={showToast} />} />
          <Route path="/projects" element={<Projects showToast={showToast} />} />
          <Route path="/matching" element={<Matching showToast={showToast} />} />
          <Route path="/search" element={<Search showToast={showToast} />} />
          <Route path="/utilization" element={<Utilization showToast={showToast} />} />
          <Route path="/how-to-work" element={<HowToWork />} />
        </Routes>
      </main>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}