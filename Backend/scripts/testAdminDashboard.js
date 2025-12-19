/**
 * 🔐 TEST ADMIN DASHBOARD
 * Tests the admin dashboard endpoint with full token flow
 */

import https from 'https';
import http from 'http';

function makeRequest(url, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const protocol = isHttps ? https : http;
    const urlObj = new URL(url);

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = protocol.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            statusText: res.statusMessage,
            body: JSON.parse(body),
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            statusText: res.statusMessage,
            body: body,
          });
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

const testAdminDashboard = async () => {
  try {
    console.log('🔒 Step 1: Getting JWT Token...\n');

    // First, get a valid JWT token
    const loginResponse = await makeRequest('http://localhost:5000/api/auth/login', 'POST', {
      email: 'admin@leafy.com',
      password: 'Admin@123456',
    });

    if (!loginResponse.body.success) {
      console.error('❌ Login failed:', loginResponse.body.message);
      process.exit(1);
    }

    const token = loginResponse.body.token;
    console.log('✅ Token received!\n');

    console.log('📊 Step 2: Testing Dashboard Endpoint...\n');

    // Now test the dashboard endpoint with the token
    const dashboardResponse = await makeRequest('http://localhost:5000/api/admin/dashboard', 'GET', null, {
      'Authorization': `Bearer ${token}`,
    });

    console.log(`📊 Response Status: ${dashboardResponse.status} ${dashboardResponse.statusText}\n`);

    if (dashboardResponse.status === 200) {
      console.log('✅ DASHBOARD ENDPOINT WORKING!\n');
      console.log('📈 Dashboard Data:');
      console.log(JSON.stringify(dashboardResponse.body.dashboard, null, 2));
    } else {
      console.log('❌ DASHBOARD ENDPOINT FAILED!\n');
      console.log('Error:', dashboardResponse.body.message);
      console.log('Full Response:', JSON.stringify(dashboardResponse.body, null, 2));
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Test Error:', error);
    console.error('Error stack:', error.stack);
    process.exit(1);
  }
};

testAdminDashboard();
