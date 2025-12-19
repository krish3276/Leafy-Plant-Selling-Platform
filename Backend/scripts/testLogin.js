/**
 * 🔒 TEST LOGIN SCRIPT
 * Tests the admin login endpoint
 */

const testLogin = async () => {
  try {
    console.log('🔒 Testing Admin Login...\n');

    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@leafy.com',
        password: 'Admin@123456',
      }),
    });

    console.log(`📊 Response Status: ${response.status} ${response.statusText}\n`);

    const data = await response.json();

    if (response.ok) {
      console.log('✅ LOGIN SUCCESSFUL!\n');
      console.log('📧 Email: admin@leafy.com');
      console.log('🔑 Password: Admin@123456');
      console.log('\n🎫 JWT Token (first 50 chars):');
      console.log(data.token.substring(0, 50) + '...\n');
      console.log('👤 User Role:', data.user.role);
      console.log('👤 User Name:', data.user.name);
    } else {
      console.log('❌ LOGIN FAILED!\n');
      console.log('Error Message:', data.message);
      if (data.errors) {
        console.log('Validation Errors:', data.errors);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Test Error:', error.message);
    console.error('\n⚠️  Make sure backend server is running on http://localhost:5000');
    process.exit(1);
  }
};

testLogin();
