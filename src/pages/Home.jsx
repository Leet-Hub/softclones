import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

// CSS-only particles - no JS timers needed
const PARTICLE_COUNT = 15;
const CSSParticles = () => (
  <div className="css-particles">
    {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
      <div key={i} className="css-particle" />
    ))}
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const heroBackground = '/image/hero2.jpg';
  const [showPopup, setShowPopup] = useState(false);
  const [showPosterPreview, setShowPosterPreview] = useState(false);

  useEffect(() => {
    setShowPopup(true);
  }, []);

  const events = [
    {
      id: 1,
      title: 'Poster Presentation',
      description: 'Showcase your research and innovative ideas through visually compelling posters. Present your work to faculty and peers in this creative competition.',
      color: '#FFE66D',
      image: '/image/Poster.png'
    },
    {
      id: 2,
      title: 'Paper Presentation',
      description: 'Present your technical research paper and demonstrate your expertise. Share your findings with the academic community and engage in knowledge exchange.',
      color: '#FF6B6B',
      image: '/image/Paper.png'
    },
    {
      id: 3,
      title: 'Quiz Competition',
      description: 'Test your knowledge across various technical domains. Compete with fellow students in this fast-paced quiz challenge and prove your expertise.',
      color: '#4ECDC4',
      image: '/image/Quiz.png'
    },
    {
      id: 4,
      title: 'C Programming',
      description: 'Demonstrate your coding skills in this challenging C programming competition. Solve algorithmic problems and showcase your problem-solving abilities.',
      color: '#95E1D3',
      image: '/image/C.png'
    }
  ];

  const handleRegister = (eventTitle) => {
    navigate(`/register?event=${encodeURIComponent(eventTitle)}`);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const scrollToEvents = () => {
    const el = document.getElementById('events-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const downloadRules = () => {
    const link = document.createElement('a');
    link.href = '/pdf/rules.pdf';
    link.download = 'rules.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openPosterPreview = () => {
    setShowPosterPreview(true);
  };

  const closePosterPreview = () => {
    setShowPosterPreview(false);
  };

  return (
    <div className="home-page">
      <CSSParticles />
      {/* Prize Popup */}
      {showPopup && (
        <>
          <div className="popup-overlay" onClick={closePopup}></div>
          <div className="prize-popup">
            <button className="popup-close" onClick={closePopup}>×</button>
            <div className="popup-content">
              <div className="popup-icon">
                <img 
                  src="./image/Trophy.png" 
                  alt="TechNova Logo" 
                  className="popup-logo"
                />
              </div>
              <h2 className="popup-title">Exciting Prizes!</h2>
              <p className="popup-subtitle">Win Amazing Cash Rewards With Trophys</p>
              <div className="prizes-list">
                <div className="prize-item first-prize">
                  <span className="prize-rank">1st Prize</span>
                  <span className="prize-amount">₹2,000</span>
                </div>
                <div className="prize-item second-prize">
                  <span className="prize-rank">2nd Prize</span>
                  <span className="prize-amount">₹1,000</span>
                </div>
                <div className="prize-item third-prize">
                  <span className="prize-rank">3rd Prize</span>
                  <span className="prize-amount">₹500</span>
                </div>
              </div>
              <button className="popup-cta" onClick={closePopup}>
                Let's Participate!
              </button>
            </div>
          </div>
        </>
      )}

      {/* Poster Preview Popup */}
      {showPosterPreview && (
        <>
          <div className="popup-overlay" onClick={closePosterPreview}></div>
          <div className="poster-preview-popup">
            <button className="popup-close" onClick={closePosterPreview}>×</button>
            <div className="poster-preview-content">
              <img 
                src="/image/Final poster.jpg" 
                alt="TechNova Event Poster" 
                className="poster-preview-image"
              />
            </div>
          </div>
        </>
      )}

      {/* Hero Section */}
      <section 
        className="hero-section"
        style={{
          backgroundImage: `url(${heroBackground})`,
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">SOFTCLONES TECHNOVA 2K26</h1>
          
          {/* Poster Image - Clickable for preview */}
          <div className="hero-poster-container" onClick={openPosterPreview}>
            <img 
              src="/image/Final poster.jpg" 
              alt="TechNova Event Poster" 
              className="hero-poster-image"
            />
            <div className="poster-click-hint">Click to view full poster</div>
          </div>
          
          {/* Logo Image
          <div className="hero-logo-container">
            <img 
              src="./image/Hi no bg.png" 
              alt="TechNova Logo" 
              className="hero-logo"
            />
          </div> */}
          
          {/* Organised By Section */}
          <div className="hero-organiser">
            <p className="organiser-label">Organised by</p>
            <p className="organiser-department">Department of Computer Engineering</p>
          </div>
          
          <div className="hero-details">
            <div className="detail-card">
              <img src="/image/cal.png" alt="Date" className="detail-icon-image" />
              <span className="detail-text">16 January 2026</span>
            </div>
            <div className="detail-card">
              <img src="/image/lo.png" alt="Location" className="detail-icon-image" />
              <span className="detail-text">Institute of Civil & Rural Engineering, Gargoti</span>
            </div>
          </div>

          <div className="hero-cta">
            <button className="view-events-button" onClick={scrollToEvents}>View Events</button>
            <button className="rules-button" onClick={downloadRules}>Download Rules</button>
          </div>
        </div>
      </section>

      {/* About Event Section */}
      <section className="about-section">
        <div className="section-container">
          <h2 className="section-title">About Us</h2>
          <div className="about-content">
            <div className="about-left-column">
              <div className="about-image-container">
                <img 
                  src="/image/Hi no bg.png" 
                  alt="TechFest" 
                  className="about-image"
                />
              </div>
              
              {/* Softclones Info Card */}
              <div className="softclones-info-card">
                <div className="softclones-header">
                  <span className="softclones-icon">💡</span>
                  <h3 className="softclones-title">About SOFTCLONES</h3>
                </div>
                <p className="softclones-description">
                  A committee of Computer Engineering students established on <strong>21st February 2000</strong>. 
                  SOFTCLONES is dedicated to nurturing technical excellence and innovation among students.
                </p>
                <div className="softclones-goal">
                  <h4 className="goal-heading">Our Goal</h4>
                  <p className="goal-text">
                    To motivate students to realize and recognize their inner potentials, to think outside 
                    the box, and to be competent enough with the present IT sector through sharing knowledge 
                    and resources.
                  </p>
                </div>
                <div className="softclones-tagline">
                  <strong>"Knowledge No Bar....."</strong>
                </div>
              </div>
            </div>
            
            <div className="about-card">
              <div className="about-highlight">
                <span className="highlight-emoji">🚀</span>
                <h3 className="about-subtitle">The Ultimate Tech Competition</h3>
              </div>
              <p className="about-text">
                TechNova 2K26 is the ultimate platform for students to showcase their technical skills, 
                innovative ideas, and creative talents. Join us for a day filled with competitions, 
                learning opportunities, and networking with like-minded individuals.
              </p>
              <div className="about-stats">
                <div className="stat-card">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Participants</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">4</span>
                  <span className="stat-label">Events</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section - Full Event Cards */}
      <section id="events-section" className="events-section">
        <div className="section-container">
          <h2 className="section-title">Events</h2> 
          <p className="section-subtitle">Choose your competition and showcase your talents</p>
          
          <div className="events-grid">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="event-card"
                style={{ backgroundColor: event.color }}
              >
                <div className="event-image-container">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="event-image"
                  />
                </div>
                <div className="event-card-content">
                  <h2 className="event-title">{event.title}</h2>
                  <p className="event-description">{event.description}</p>
                </div>
                <button 
                  className="register-button"
                  onClick={() => handleRegister(event.title)}
                >
                  Register Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;