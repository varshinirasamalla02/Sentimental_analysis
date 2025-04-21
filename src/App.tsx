import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ReviewList from './pages/reviews/ReviewList';
import ReviewDetail from './pages/reviews/ReviewDetail';
import AddReview from './pages/reviews/AddReview';
import SentimentAnalysis from './pages/SentimentAnalysis';
import NotFound from './pages/NotFound';

import PrivateRoute from './components/auth/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* Navbar at the top */}
          <Navbar />

          {/* Main content area */}
          <main className="flex-grow bg-gray-50">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route
                path="/reviews"
                element={
                  <PrivateRoute>
                    <ReviewList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reviews/:id"
                element={
                  <PrivateRoute>
                    <ReviewDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reviews/add"
                element={
                  <PrivateRoute>
                    <AddReview />
                  </PrivateRoute>
                }
              />
              <Route
                path="/analysis"
                element={
                  <PrivateRoute>
                    <SentimentAnalysis />
                  </PrivateRoute>
                }
              />

              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Footer at the bottom */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
