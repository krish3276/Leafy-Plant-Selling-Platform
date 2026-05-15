/*
 * Test both admin and customer login flows
 * Usage: node scripts/testBothLogins.js
 */

const run = async () => {
  try {
    const base = 'http://localhost:5000/api/auth';

    // Admin login
    const adminRes = await fetch(`${base}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@leafy.com', password: 'Admin@123456' }),
    });
    const adminData = await adminRes.json();

    console.log('--- ADMIN LOGIN ---');
    console.log('status:', adminRes.status);
    console.log('body:', JSON.stringify(adminData));

    // Create temporary customer via signup
    const unique = Date.now();
    const customerEmail = `testuser_${unique}@example.com`;
    const signupRes = await fetch(`${base}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: 'Test', lastName: 'User', email: customerEmail, password: 'Test@12345', confirmPassword: 'Test@12345' }),
    });
    const signupData = await signupRes.json();

    console.log('--- CUSTOMER SIGNUP ---');
    console.log('status:', signupRes.status);
    console.log('body:', JSON.stringify(signupData));

    // Customer login
    const custLoginRes = await fetch(`${base}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: customerEmail, password: 'Test@12345' }),
    });
    const custLoginData = await custLoginRes.json();

    console.log('--- CUSTOMER LOGIN ---');
    console.log('status:', custLoginRes.status);
    console.log('body:', JSON.stringify(custLoginData));

    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(2);
  }
};

run();
