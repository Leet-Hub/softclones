// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzlz2iqvCaYgS-IGIul-dcVUTCqOTXWFoFoIZZmXL7xOk3FHgzVIDmYoJtmHXPpAbjU/exec';

/**
 * Submit registration data to Google Apps Script (Team of 2)
 * @param {Object} formData - Registration form data
 * @returns {Promise<Object>} Response object with success status and message
 */
export const submitRegistration = async (formData) => {
  try {
    console.log('Submitting registration:', formData);
    
    // Validate required fields
    const requiredFields = ['name1', 'email1', 'phone1', 'name2', 'email2', 'phone2', 'college', 'event', 'transactionId'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      return {
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        error: 'VALIDATION_ERROR'
      };
    }

    // Prepare data for submission (add action parameter)
    const registrationData = {
      action: 'register',
      name1: formData.name1,
      email1: formData.email1,
      phone1: formData.phone1,
      name2: formData.name2,
      email2: formData.email2,
      phone2: formData.phone2,
      college: formData.college,
      event: formData.event,
      transactionId: formData.transactionId,
      timestamp: new Date().toISOString()
    };

    console.log('Sending data to Google Apps Script:', registrationData);

    // Send POST request to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(registrationData),
      redirect: 'follow',
      mode: 'cors'
    });

    console.log('Response status:', response.status);

    // Get the response text
    const responseText = await response.text();
    console.log('Response text:', responseText);

    // Try to parse the response as JSON
    let jsonResult;
    try {
      jsonResult = JSON.parse(responseText);
      console.log('Parsed JSON result:', jsonResult);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      console.error('Response was:', responseText);
      
      return {
        success: false,
        message: 'Server returned an invalid response. Please try again.',
        error: 'PARSE_ERROR',
        details: responseText.substring(0, 200)
      };
    }

    // Handle the parsed JSON response
    if (jsonResult.success === true) {
      console.log('✅ Registration successful');
      return {
        success: true,
        message: jsonResult.message || 'Registration submitted successfully!',
        data: jsonResult
      };
    } else {
      console.log('❌ Registration failed:', jsonResult.message);
      
      // Check if it's a duplicate transaction ID error
      const isDuplicate = jsonResult.isDuplicate === true || 
                         (jsonResult.message && jsonResult.message.toLowerCase().includes('already been used'));
      
      return {
        success: false,
        message: jsonResult.message || 'Registration failed. Please try again.',
        error: jsonResult.error,
        isDuplicate: isDuplicate,
        details: jsonResult
      };
    }

  } catch (error) {
    console.error('❌ Network or submission error:', error);
    
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
      error: error.message,
      errorType: 'NETWORK_ERROR'
    };
  }
};

/**
 * Get all registrations (for admin)
 */
export const getAllRegistrations = async () => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        action: 'getAllRegistrations'
      }),
      redirect: 'follow',
      mode: 'cors'
    });

    const responseText = await response.text();
    const jsonResult = JSON.parse(responseText);

    if (jsonResult.success) {
      return {
        success: true,
        registrations: jsonResult.registrations || []
      };
    } else {
      return {
        success: false,
        message: jsonResult.message || 'Failed to fetch registrations',
        registrations: []
      };
    }
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return {
      success: false,
      message: 'Failed to fetch registrations',
      registrations: [],
      error: error.message
    };
  }
};

/**
 * Verify payment (for admin)
 */
export const verifyPayment = async (registrationData) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        action: 'verifyPayment',
        ...registrationData
      }),
      redirect: 'follow',
      mode: 'cors'
    });

    const responseText = await response.text();
    const jsonResult = JSON.parse(responseText);

    return jsonResult;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return {
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    };
  }
};

// Export the URL for configuration purposes
export { GOOGLE_SCRIPT_URL };