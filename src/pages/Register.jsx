import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitRegistration } from '../services/api';
import './Register.css';

// CSS-only particles - no JS timers needed
const PARTICLE_COUNT = 25;
const CSSParticles = () => (
  <div className="css-particles">
    {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
      <div key={i} className="css-particle" />
    ))}
  </div>
);

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('');
  const [formData, setFormData] = useState({
    name1: '',
    email1: '',
    phone1: '',
    name2: '',
    email2: '',
    phone2: '',
    collegeName: '',
    paymentMethod: '',
    transactionId: ''
  });

  // Refs for scrolling to fields
  const fieldRefs = {
    name1: useRef(null),
    email1: useRef(null),
    phone1: useRef(null),
    name2: useRef(null),
    email2: useRef(null),
    phone2: useRef(null),
    collegeName: useRef(null),
    paymentMethod: useRef(null),
    transactionId: useRef(null)
  };

  // Payment method configurations
  const paymentConfigs = {
    PhonePe: {
      qrImage: '/image/phonepe-qr.png',
      screenshotImage: '/image/phonepe-screenshot.png',
      upiIds: ['sudarshan.lanjile@ybl'],
      upiNumber: '7666465998',
      note: 'Please ensure the payment name shows as "Sudarshan Reddy"',
      transactionLabel: 'UTR ID'
    },
    Paytm: {
      qrImage: '/image/paytm-qr.png',
      screenshotImage: '/image/paytm-screenshot.png',
      upiIds: ['7666465998@ptaxis', '7666465998@ptyes', '7666465998@ptsbi'],
      upiNumber: '7666465998',
      note: 'Please ensure the payment name shows as "Sudarshan Sunil Lanjile',
      transactionLabel: 'UPI Reference No.'
    },
    GooglePay: {
      qrImage: '/image/gpay-qr.png',
      screenshotImage: '/image/gpay-screenshot.png',
      upiIds: ['sudarshanlanjileme@oksbi'],
      upiNumber: '7666465998',
      note: 'Please ensure the payment name shows as "Sudarshan Reddy"',
      transactionLabel: 'UPI Transaction ID'
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const eventName = params.get('event');
    if (eventName) {
      setSelectedEvent(eventName);
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  const getRegistrationHeading = () => {
    if (!selectedEvent) return 'Event Registration';
    const eventWords = selectedEvent.split(' ');
    const mainEvent = eventWords[0];
    return `${mainEvent} Registration`;
  };

  const getTransactionIdLabel = () => {
    if (paymentMethod && paymentConfigs[paymentMethod]) {
      return paymentConfigs[paymentMethod].transactionLabel;
    }
    return 'Transaction ID';
  };

  // Scroll to first error field
  const scrollToFirstError = (errorFields) => {
    const fieldOrder = ['collegeName', 'name1', 'email1', 'phone1', 'name2', 'email2', 'phone2', 'paymentMethod'];
    
    for (let field of fieldOrder) {
      if (errorFields[field] && fieldRefs[field]?.current) {
        fieldRefs[field].current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        
        // Focus the input after scrolling
        setTimeout(() => {
          fieldRefs[field].current.focus();
        }, 500);
        
        break;
      }
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name1':
      case 'name2':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 3) return 'Name must be at least 3 characters';
        if (!/^[a-zA-Z\s.]+$/.test(value)) return 'Name can only contain letters and spaces';
        return '';

      case 'collegeName':
        if (!value.trim()) return 'College name is required';
        if (value.trim().length < 3) return 'College name must be at least 3 characters';
        return '';

      case 'email1':
      case 'email2':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';

      case 'phone1':
      case 'phone2':
        if (!value.trim()) return 'Phone number is required';
        const phoneDigits = value.replace(/\D/g, '');
        if (phoneDigits.length !== 10) return 'Phone number must be exactly 10 digits';
        if (!/^[6-9]/.test(phoneDigits)) return 'Phone number must start with 6, 7, 8, or 9';
        return '';

      case 'paymentMethod':
        if (!value) return 'Payment method is required';
        return '';

      case 'transactionId':
        if (!value.trim()) return `${getTransactionIdLabel()} is required`;
        if (!/^\d+$/.test(value)) return `${getTransactionIdLabel()} must contain only numbers`;
        if (value.length !== 12) return `${getTransactionIdLabel()} must be exactly 12 digits`;
        return '';

      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'transactionId') {
      processedValue = value.replace(/\D/g, '').slice(0, 12);
    } else if (name === 'phone1' || name === 'phone2') {
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'paymentMethod') {
      setPaymentMethod(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    if (touched[name]) {
      const error = validateField(name, processedValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = ['name1', 'email1', 'phone1', 'name2', 'email2', 'phone2', 'collegeName', 'paymentMethod'];
    
    fieldsToValidate.forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({
      name1: true,
      email1: true,
      phone1: true,
      name2: true,
      email2: true,
      phone2: true,
      collegeName: true,
      paymentMethod: true
    });

    return newErrors;
  };

  const showPopupMessage = (message, type) => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    if (popupType === 'success') {
      navigate('/');
    }
  };

  const closePaymentPopup = () => {
    setShowPaymentPopup(false);
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      scrollToFirstError(validationErrors);
      return;
    }

    setShowPaymentPopup(true);
  };

  const handleFinalSubmit = async () => {
    const transactionError = validateField('transactionId', formData.transactionId);
    if (transactionError) {
      setErrors(prev => ({
        ...prev,
        transactionId: transactionError
      }));
      setTouched(prev => ({
        ...prev,
        transactionId: true
      }));
      
      // Scroll to transaction ID field in popup
      const transactionInput = document.getElementById('transactionId');
      if (transactionInput) {
        transactionInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => transactionInput.focus(), 300);
      }
      
      return;
    }

    setIsSubmitting(true);

    try {
      const registrationData = {
        name1: formData.name1.trim(),
        email1: formData.email1.trim().toLowerCase(),
        phone1: formData.phone1,
        name2: formData.name2.trim(),
        email2: formData.email2.trim().toLowerCase(),
        phone2: formData.phone2,
        college: formData.collegeName.trim(),
        event: selectedEvent,
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId
      };

      const result = await submitRegistration(registrationData);

      if (result.success) {
        setShowPaymentPopup(false);
        showPopupMessage(
          'registration_success', // Special identifier for custom styling
          'success'
        );

        setFormData({
          name1: '',
          email1: '',
          phone1: '',
          name2: '',
          email2: '',
          phone2: '',
          collegeName: '',
          paymentMethod: '',
          transactionId: ''
        });
        setPaymentMethod('');
        setErrors({});
        setTouched({});
      } else {
        const errorMessage = result.message || '';
        const isDuplicateError = 
          errorMessage.toLowerCase().includes('already been used') ||
          errorMessage.toLowerCase().includes('duplicate') ||
          errorMessage.toLowerCase().includes('invalid transaction id') ||
          result.isDuplicate === true;

        if (isDuplicateError) {
          setErrors(prev => ({
            ...prev,
            transactionId: `This ${getTransactionIdLabel()} has already been used. Please enter a different one.`
          }));
          
          setTouched(prev => ({
            ...prev,
            transactionId: true
          }));
          
          showPopupMessage(
            `This ${getTransactionIdLabel()} has already been used. Please check and enter a unique one.`,
            'error'
          );
        } else {
          setShowPaymentPopup(false);
          showPopupMessage(
            result.message || 'Registration failed. Please check your details and try again.',
            'error'
          );
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      
      const errorMessage = error.response?.data?.message || error.message || '';
      const isDuplicateError = 
        errorMessage.toLowerCase().includes('already been used') ||
        errorMessage.toLowerCase().includes('duplicate') ||
        errorMessage.toLowerCase().includes('invalid transaction id');

      if (isDuplicateError) {
        setErrors(prev => ({
          ...prev,
          transactionId: `This ${getTransactionIdLabel()} has already been used. Please enter a different one.`
        }));
        
        setTouched(prev => ({
          ...prev,
          transactionId: true
        }));
        
        showPopupMessage(
          `This ${getTransactionIdLabel()} has already been used. Please enter a unique one.`,
          'error'
        );
      } else {
        setShowPaymentPopup(false);
        showPopupMessage(
          errorMessage || 'An error occurred during registration. Please try again.',
          'error'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      const tempMessage = document.createElement('div');
      tempMessage.textContent = `${type} copied!`;
      tempMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4ECDC4;
        color: #1a1a1a;
        padding: 12px 24px;
        border: 3px solid #1a1a1a;
        font-weight: 700;
        z-index: 10000;
        animation: slideIn 0.3s ease;
      `;
      document.body.appendChild(tempMessage);
      setTimeout(() => document.body.removeChild(tempMessage), 2000);
    } catch (err) {
      alert(`${type} copied to clipboard!`);
    }
  };

  const isFormValid = () => {
    const requiredFields = ['name1', 'email1', 'phone1', 'name2', 'email2', 'phone2', 'collegeName', 'paymentMethod'];
    return requiredFields.every(field => formData[field].trim() !== '') &&
           requiredFields.every(field => !errors[field]);
  };

  const currentPaymentConfig = paymentMethod ? paymentConfigs[paymentMethod] : null;

  return (
    <div className="register-page">
      <CSSParticles />
      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-modal" onClick={(e) => e.stopPropagation()}>
            <div className={`popup-content ${popupType}`}>
              <div className="popup-icon">
                {popupType === 'success' ? '✓' : '✕'}
              </div>
              
              {popupMessage === 'registration_success' ? (
                <div className="success-message-container">
                  <h2 className="success-title">Registration Successful!</h2>
                  <div className="success-highlights">
                    <div className="highlight-box">
                      <div className="highlight-icon">📧</div>
                      <div className="highlight-content">
                        <h3>Check Your Email!</h3>
                        <ul className="email-list">                        
                          <li>
                            <span> <strong>Payment Will be verified  </strong>Within 24 hours with your token number & WhatsApp group link</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="email-reminder">
                      <span className="reminder-icon">⚠️</span>
                      <p><strong>Important:</strong> Please check your email inbox (and spam folder) for both confirmation emails!</p>
                    </div>
                  </div>
                  <button className="popup-button" onClick={closePopup}>
                    Got It!
                  </button>
                </div>
              ) : (
                <>
                  <p className="popup-message">{popupMessage}</p>
                  <button className="popup-button" onClick={closePopup}>
                    {popupType === 'success' ? 'Go to Home' : 'OK'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showPaymentPopup && currentPaymentConfig && (
        <div className="popup-overlay">
          <div className="payment-popup-modal" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-btn" onClick={closePaymentPopup}>×</button>
            <div className="payment-popup-content">
              <h2 className="payment-popup-title">{paymentMethod} Payment</h2>
              
              <div className="payment-note">
                <p className="note-text">
                  <strong>Important:</strong> Registration fee is <strong>₹200 per team (2 members)</strong>. 
                  Please make a single payment of ₹200 for both team members.
                </p>
                <p className="note-text" style={{marginTop: '10px'}}>
                  {currentPaymentConfig.note}
                </p>
              </div>

              <div className="qr-container">
                <img 
                  src={currentPaymentConfig.qrImage}
                  alt={`${paymentMethod} QR Code`}
                  className="qr-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="qr-placeholder" style={{display: 'none'}}>
                  <p>QR Code</p>
                  <p className="qr-text">Image not available</p>
                </div>
              </div>

              <div className="upi-details upi-highlight">
                <p className="upi-heading">⚠️ If QR code is not working, use these details:</p>
                
                {currentPaymentConfig.upiIds.map((upiId, index) => (
                  <div className="upi-item" key={index}>
                    <div className="upi-label upi-label-highlight">
                      {currentPaymentConfig.upiIds.length > 1 ? `UPI ID ${index + 1}:` : 'UPI ID:'}
                    </div>
                    <div className="upi-value-container">
                      <span className="upi-value upi-value-highlight">{upiId}</span>
                      <button 
                        type="button" 
                        className="copy-button"
                        onClick={() => copyToClipboard(upiId, 'UPI ID')}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))}

                <div className="upi-item">
                  <div className="upi-label upi-label-highlight">UPI Number:</div>
                  <div className="upi-value-container">
                    <span className="upi-value upi-value-highlight">+91 {currentPaymentConfig.upiNumber}</span>
                    <button 
                      type="button" 
                      className="copy-button"
                      onClick={() => copyToClipboard(`+91 ${currentPaymentConfig.upiNumber}`, 'Phone Number')}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              <div className="screenshot-section">
                <h3 className="screenshot-heading">📸 Where to find your {getTransactionIdLabel()}?</h3>
                <div className="screenshot-container">
                  <img 
                    src={currentPaymentConfig.screenshotImage}
                    alt={`${paymentMethod} ${getTransactionIdLabel()} Example`}
                    className="screenshot-image"
                  />
                </div>
              </div>

              <div className="contact-payment">
                <p className="contact-text"><strong>Contact for Payment Queries:</strong> <a href="tel:+917666465998">+91 7666465998</a></p>
              </div>

              <div className="form-group">
                <label htmlFor="transactionId" className="label-highlight">
                  {getTransactionIdLabel()} * (12 digits)
                </label>
                <input
                  type="text"
                  id="transactionId"
                  name="transactionId"
                  ref={fieldRefs.transactionId}
                  value={formData.transactionId}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  maxLength="12"
                  className={`form-input ${errors.transactionId && touched.transactionId ? 'error' : ''}`}
                  placeholder={`Enter 12-digit ${getTransactionIdLabel()}`}
                />
                {errors.transactionId && touched.transactionId && (
                  <span className="error-message">{errors.transactionId}</span>
                )}
              </div>

              <button 
                type="button" 
                className="submit-button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Complete Registration'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="register-container">
        <h1 className="register-heading">{getRegistrationHeading()}</h1>
        
        <form onSubmit={handleInitialSubmit} className="registration-form" noValidate>
          
          <div className="form-section participant-section">
            <h2 className="section-heading">Team Details (2 Members)</h2>
            
            <div className="form-group">
              <label htmlFor="event" className="label-highlight">Selected Event</label>
              <input
                type="text"
                id="event"
                name="event"
                value={selectedEvent}
                readOnly
                className="form-input read-only"
              />
            </div>

            <div className="form-group">
              <label htmlFor="collegeName" className="label-highlight">College Name *</label>
              <input
                type="text"
                id="collegeName"
                name="collegeName"
                ref={fieldRefs.collegeName}
                value={formData.collegeName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                className={`form-input ${errors.collegeName && touched.collegeName ? 'error' : ''}`}
                placeholder="Your college name"
              />
              {errors.collegeName && touched.collegeName && (
                <span className="error-message">{errors.collegeName}</span>
              )}
            </div>

            <div style={{marginTop: '30px', borderTop: '3px solid #1a1a1a', paddingTop: '25px'}}>
              <h3 style={{fontSize: '1.2rem', fontWeight: '900', marginBottom: '20px', color: '#1a1a1a'}}>
                MEMBER 1 DETAILS
              </h3>

              <div className="form-group">
                <label htmlFor="name1" className="label-highlight">Full Name *</label>
                <input
                  type="text"
                  id="name1"
                  name="name1"
                  ref={fieldRefs.name1}
                  value={formData.name1}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`form-input ${errors.name1 && touched.name1 ? 'error' : ''}`}
                  placeholder="Member 1 full name"
                />
                {errors.name1 && touched.name1 && (
                  <span className="error-message">{errors.name1}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email1" className="label-highlight">Email Address *</label>
                <input
                  type="email"
                  id="email1"
                  name="email1"
                  ref={fieldRefs.email1}
                  value={formData.email1}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`form-input ${errors.email1 && touched.email1 ? 'error' : ''}`}
                  placeholder="Member 1 email"
                />
                {errors.email1 && touched.email1 && (
                  <span className="error-message">{errors.email1}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone1" className="label-highlight">Phone Number * (10 digits)</label>
                <input
                  type="tel"
                  id="phone1"
                  name="phone1"
                  ref={fieldRefs.phone1}
                  value={formData.phone1}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  maxLength="10"
                  className={`form-input ${errors.phone1 && touched.phone1 ? 'error' : ''}`}
                  placeholder="Member 1 phone"
                />
                {errors.phone1 && touched.phone1 && (
                  <span className="error-message">{errors.phone1}</span>
                )}
              </div>
            </div>

            <div style={{marginTop: '30px', borderTop: '3px solid #1a1a1a', paddingTop: '25px'}}>
              <h3 style={{fontSize: '1.2rem', fontWeight: '900', marginBottom: '20px', color: '#1a1a1a'}}>
                MEMBER 2 DETAILS
              </h3>

              <div className="form-group">
                <label htmlFor="name2" className="label-highlight">Full Name *</label>
                <input
                  type="text"
                  id="name2"
                  name="name2"
                  ref={fieldRefs.name2}
                  value={formData.name2}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`form-input ${errors.name2 && touched.name2 ? 'error' : ''}`}
                  placeholder="Member 2 full name"
                />
                {errors.name2 && touched.name2 && (
                  <span className="error-message">{errors.name2}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email2" className="label-highlight">Email Address *</label>
                <input
                  type="email"
                  id="email2"
                  name="email2"
                  ref={fieldRefs.email2}
                  value={formData.email2}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`form-input ${errors.email2 && touched.email2 ? 'error' : ''}`}
                  placeholder="Member 2 email"
                />
                {errors.email2 && touched.email2 && (
                  <span className="error-message">{errors.email2}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone2" className="label-highlight">Phone Number * (10 digits)</label>
                <input
                  type="tel"
                  id="phone2"
                  name="phone2"
                  ref={fieldRefs.phone2}
                  value={formData.phone2}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  maxLength="10"
                  className={`form-input ${errors.phone2 && touched.phone2 ? 'error' : ''}`}
                  placeholder="Member 2 phone"
                />
                {errors.phone2 && touched.phone2 && (
                  <span className="error-message">{errors.phone2}</span>
                )}
              </div>
            </div>

            <div style={{marginTop: '30px', borderTop: '3px solid #1a1a1a', paddingTop: '25px'}}>
              <h3 style={{fontSize: '1.2rem', fontWeight: '900', marginBottom: '20px', color: '#1a1a1a'}}>
                PAYMENT METHOD
              </h3>

              <div className="form-group">
                <label htmlFor="paymentMethod" className="label-highlight">Select Payment Method *</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  ref={fieldRefs.paymentMethod}
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`form-input ${errors.paymentMethod && touched.paymentMethod ? 'error' : ''}`}
                >
                  <option value="">Choose payment method</option>
                  <option value="GooglePay">Google Pay</option>
                  <option value="Paytm">Paytm</option>
                  <option value="PhonePe">PhonePe</option>
                </select>
                {errors.paymentMethod && touched.paymentMethod && (
                  <span className="error-message">{errors.paymentMethod}</span>
                )}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={!isFormValid()}
          >
            Proceed to Payment
          </button>

        </form>
      </div>
    </div>
  );
};

export default Register;