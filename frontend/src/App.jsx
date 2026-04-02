import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ResumeForm from './pages/ResumeForm.jsx';
import ResumePreview from './pages/ResumePreview.jsx';
import Navbar from './components/Navbar.jsx';

// Protect Routes
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <div className="min-h-[calc(100vh-73px)] flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/resume-builder" element={<PrivateRoute><ResumeForm /></PrivateRoute>} />
          <Route path="/resume-builder/:id" element={<PrivateRoute><ResumeForm /></PrivateRoute>} />
          <Route path="/preview/:id" element={<PrivateRoute><ResumePreview /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
