/**
 * Razorpay Frontend Utility
 * Handles opening the Razorpay payment modal with test-mode configuration.
 */

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Creates a Razorpay order on the backend and opens the payment modal.
 * Returns a Promise that resolves with the payment response or rejects on failure/dismiss.
 *
 * @param {Object} options
 * @param {string} options.token - JWT auth token
 * @param {Object} options.userInfo - { name, email } for pre-filling modal
 * @returns {Promise<{ razorpay_order_id, razorpay_payment_id, razorpay_signature }>}
 */
export const initiateRazorpayPayment = ({ token, userInfo }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Step 1: Create a Razorpay order via backend
      const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        return reject(new Error(data.message || 'Failed to create payment order'));
      }

      // Step 2: Open Razorpay modal
      const options = {
        key: data.keyId,
        amount: data.amount,           // in paise
        currency: data.currency,
        name: 'Leafy 🌱',
        description: 'Plant Purchase — Test Payment',
        image: 'https://ik.imagekit.io/demo/img/image10.jpeg', // fallback logo
        order_id: data.razorpayOrderId,
        handler: (response) => {
          // Payment successful — resolve with Razorpay response
          resolve({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amountINR: data.amountINR,
          });
        },
        prefill: {
          name: userInfo?.name || '',
          email: userInfo?.email || '',
          contact: userInfo?.phone || '',
        },
        theme: {
          color: '#4caf50',
          backdrop_color: 'rgba(0,0,0,0.7)',
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'));
          },
          confirm_close: true,
        },
        config: {
          display: {
            blocks: {
              utib: { name: 'Pay via Card', instruments: [{ method: 'card' }] },
            },
            sequence: ['block.utib'],
            preferences: { show_default_blocks: true },
          },
        },
      };

      // Razorpay is loaded globally via CDN in index.html
      if (!window.Razorpay) {
        return reject(new Error('Razorpay SDK not loaded. Please refresh the page.'));
      }

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', (response) => {
        reject(new Error(response.error?.description || 'Payment failed'));
      });

      rzp.open();
    } catch (error) {
      reject(error);
    }
  });
};
