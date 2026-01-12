import React from 'react';
import { Routes, Route } from 'react-router-dom';

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
import Gigs from './pages/Gigs';           
import About from './pages/About';         
import Notifications from './pages/Notifications'; 

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/gigs" element={<Gigs />} />
          <Route path="/about" element={<About />} />
          
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
          
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;