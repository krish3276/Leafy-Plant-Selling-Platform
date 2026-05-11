import http from 'http';

async function test(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, body: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  // console.log('🔧 Testing Leafy Backend API\n');

  try {
    // Test 1: Health check
    // console.log('Test 1: Health Check');
    const health = await test('GET', '/api/health');
      // console.log(`Status: ${health.status}`);
      // console.log(`Response: ${JSON.stringify(health.body, null, 2)}\n`);

    // Test 2: Login
    // console.log('Test 2: Admin Login');
    const login = await test('POST', '/api/auth/login', {
      email: 'admin@leafy.com',
      password: 'Admin@123456',
    });
    // console.log(`Status: ${login.status}`);
    
    if (login.body.success) {
      // console.log(`✅ Login successful!`);
      // console.log(`Token: ${login.body.token.substring(0, 50)}...\n`);

      // Test 3: Dashboard with token
      // console.log('Test 3: Admin Dashboard');
      const dashboardOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/admin/dashboard',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${login.body.token}`,
          'Content-Type': 'application/json',
        },
      };

      const dashboard = await new Promise((resolve) => {
        const req = http.request(dashboardOptions, (res) => {
          let body = '';
          res.on('data', (chunk) => body += chunk);
          res.on('end', () => {
            try {
              resolve({ status: res.statusCode, body: JSON.parse(body) });
            } catch {
              resolve({ status: res.statusCode, body: body });
            }
          });
        });
        req.on('error', (e) => resolve({ status: 0, body: `Error: ${e.message}` }));
        req.end();
      });

      // console.log(`Status: ${dashboard.status}`);
      if (dashboard.status === 200) {
        // console.log(`✅ Dashboard endpoint working!`);
        // console.log(`Response: ${JSON.stringify(dashboard.body, null, 2)}`);
      } else {
        // console.log(`❌ Dashboard failed!`);
        // console.log(`Response: ${JSON.stringify(dashboard.body, null, 2)}`);
      }
    } else {
      // console.log(`❌ Login failed!`);
      // console.log(`Response: ${JSON.stringify(login.body, null, 2)}`);
    }
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

runTests();
