// adminApi.js - UNIFIED API FOR ADMIN PANEL
// Use the SAME URL as your registration form
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzlz2iqvCaYgS-IGIul-dcVUTCqOTXWFoFoIZZmXL7xOk3FHgzVIDmYoJtmHXPpAbjU/exec';



/**
 * Get all registrations from Google Sheets
 */
export const getAllRegistrations = async () => {
  try {
    console.log('Fetching registrations from:', APPS_SCRIPT_URL);
    
    const response = await fetch(APPS_SCRIPT_URL, {
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

    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    console.log('Response text:', responseText);
    
    const data = JSON.parse(responseText);
    console.log('Parsed data:', data);

    if (data.success) {
      return data.registrations || [];
    } else {
      throw new Error(data.message || 'Failed to fetch registrations');
    }
  } catch (error) {
    console.error('Error fetching registrations:', error);
    throw error;
  }
};

/**
 * Verify payment for a team registration
 */
export const verifyPayment = async (registration, rowIndex) => {
  try {
    console.log('Verifying payment for:', registration);
    console.log('Row index:', rowIndex);
    
    const requestData = {
      action: 'verifyPayment',
      rowIndex: rowIndex + 2, // +2 because row 1 is header and array is 0-indexed
      email1: registration.email1,
      email2: registration.email2,
      name1: registration.name1,
      name2: registration.name2,
      event: registration.event
    };
    
    console.log('Sending verification request:', requestData);
    
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(requestData),
      redirect: 'follow',
      mode: 'cors'
    });

    console.log('Verification response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    console.log('Verification response text:', responseText);
    
    const data = JSON.parse(responseText);
    console.log('Parsed verification data:', data);

    if (data.success) {
      return {
        success: true,
        tokenNumber: data.tokenNumber,
        groupLink: data.groupLink,
        message: data.message || 'Payment verified successfully'
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to verify payment'
      };
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};