import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './features/authSlice';

// Import all components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Import all pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateGig from './pages/CreateGig';
import GigDetails from './pages/GigDetails';
import Profile from './pages/Profile';
import MyGigs from './pages/MyGigs';
import MyBids from './pages/MyBids';
import About from './pages/About'; // ADD THIS IMPORT

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Check if user is logged in ONLY if we think we're authenticated
  useEffect(() => {
    // Only try to get current user if we have a user in localStorage
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"> {/* Updated background to match your theme */}
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} /> {/* ADD THIS ROUTE */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/create-gig" element={
            <ProtectedRoute>
              <CreateGig />
            </ProtectedRoute>
          } />
          
          <Route path="/gig/:id" element={
            <ProtectedRoute>
              <GigDetails />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/my-gigs" element={
            <ProtectedRoute>
              <MyGigs />
            </ProtectedRoute>
          } />
          
          <Route path="/my-bids" element={
            <ProtectedRoute>
              <MyBids />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;