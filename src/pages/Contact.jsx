import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-description">
          Have questions about the event? Need assistance with registration? 
          Feel free to reach out to our event coordinator.
        </p>

        <div className="contact-cards">
          {/* Coordinator Card */}
          <div className="contact-card coordinator-card">
            <div className="card-header">
              <h2>Event Coordinator</h2>
            </div>
            <div className="card-content">
              <div className="contact-item">
                <div className="contact-icon">👤</div>
                <div className="contact-details">
                  <span className="contact-label">Name</span>
                  <span className="contact-value">Sudarshan Reddy</span>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div className="contact-details">
                  <span className="contact-label">Email</span>
                  <span className="contact-value">leethub.official@gmail.com</span>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div className="contact-details">
                  <span className="contact-label">Phone</span>
                  <span className="contact-value">+91 7666465998</span>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">🏛️</div>
                <div className="contact-details">
                  <span className="contact-label">Institution</span>
                  <span className="contact-value">Institute of Civil & Rural Engineering, Gargoti, Kolhapur</span>
                </div>
              </div>
            </div>
          </div>

          {/* Event Info Card */}
          <div className="contact-card event-info-card">
            <div className="card-header">
              <h2>Event Details</h2>
            </div>
            <div className="card-content">
              <div className="contact-item">
                <div className="contact-icon">📅</div>
                <div className="contact-details">
                  <span className="contact-label">Date</span>
                  <span className="contact-value">16 January 2026</span>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div className="contact-details">
                  <span className="contact-label">Venue</span>
                  <span className="contact-value">Institute of Civil & Rural Engineering, Gargoti, Kolhapur.</span>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">⏰</div>
                <div className="contact-details">
                  <span className="contact-label">Time</span>
                  <span className="contact-value">9:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Note Section */}
        <div className="quick-note">
          <p>
            <strong>Note:</strong> For urgent queries, please call directly. 
            Email responses may take 24-48 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;