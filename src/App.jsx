// src/App.jsx (updated)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import './index.css';
import { AuthProvider } from './services/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<Login />} />
          
          {/* Protected admin route */}
          <Route 
            path="/admin/*" 
            element={
              <PrivateRoute redirectTo="/">
                <AdminPage />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
