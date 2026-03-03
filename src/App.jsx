// App.jsx - Updated with Sticky Social Icons
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import Sticky from './components/Sticky';
import Home from './pages/Home';
import Register from './pages/Register';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';
import ScrollToTop from './components/ScrollToTop';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);

  // Show loader only on first visit
  useEffect(() => {
    // Check if user has already visited
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    if (hasVisited) {
      // User has visited before in this session, skip loader
      setIsLoading(false);
      return;
    }

    // First time visitor - show loader
    const images = document.querySelectorAll('img');
    
    if (images.length === 0) {
      // No images, hide loader after minimum time
      setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem('hasVisited', 'true');
      }, 1000);
      return;
    }

    let loadedCount = 0;
    const totalImages = images.length;

    const imageLoadHandler = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        setTimeout(() => {
          setIsLoading(false);
          sessionStorage.setItem('hasVisited', 'true');
        }, 500);
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        imageLoadHandler();
      } else {
        img.addEventListener('load', imageLoadHandler);
        img.addEventListener('error', imageLoadHandler);
      }
    });

    // Fallback: Hide loader after 3 seconds
    const fallbackTimeout = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('hasVisited', 'true');
    }, 3000);

    return () => {
      clearTimeout(fallbackTimeout);
      images.forEach((img) => {
        img.removeEventListener('load', imageLoadHandler);
        img.removeEventListener('error', imageLoadHandler);
      });
    };
  }, []);

  return (
    <div className="App">
      <Routes>
        {/* Admin Routes - No Navbar/Footer/Sticky */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Public Routes - With Navbar/Footer/Sticky */}
        <Route
          path="/*"
          element={
            <>
              <Loader isLoading={isLoading} />
              <Navbar />
              <Sticky />
              <ScrollToTop />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;