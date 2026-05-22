import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

export const isRazorpayConfigured = () =>
  Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

export const getRazorpayInstance = () => {
  if (!isRazorpayConfigured()) {
    return null;
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

export default getRazorpayInstance;
