/**
 * 🧪 ADMIN NOTIFICATION ENDPOINTS TEST SUITE
 * 
 * This file provides test cases for the Admin Notification Preferences API
 * 
 * How to use:
 * 1. Update the BASE_URL and AUTH_TOKEN
 * 2. Run the test functions in order
 * 3. Check console output for results
 */

const BASE_URL = 'http://localhost:5000/api/admin';
const AUTH_TOKEN = 'your_admin_auth_token_here'; // Replace with actual token

// Helper function for API calls
async function makeRequest(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    console.log(`\n${method} ${endpoint}`);
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    return { status: response.status, data };
  } catch (error) {
    console.error('Request failed:', error);
  }
}

// ============================================
// TEST 1: Get Notification Preferences
// ============================================
async function testGetPreferences() {
  console.log('\n========== TEST 1: Get Notification Preferences ==========');
  return await makeRequest('/notifications/preferences');
}

// ============================================
// TEST 2: Update Specific Notification Type
// ============================================
async function testUpdateNotificationType() {
  console.log('\n========== TEST 2: Update Specific Notification Type ==========');
  
  // Test 2.1: Disable email for order placed
  console.log('\n--- Test 2.1: Disable email for orderPlaced ---');
  await makeRequest('/notifications/preferences/type', 'PUT', {
    notificationType: 'orderPlaced',
    email: false,
  });

  // Test 2.2: Disable entire notification type
  console.log('\n--- Test 2.2: Disable entire orderUpdated notification ---');
  await makeRequest('/notifications/preferences/type', 'PUT', {
    notificationType: 'orderUpdated',
    enabled: false,
  });

  // Test 2.3: Enable push for product updates
  console.log('\n--- Test 2.3: Enable push for productUpdates ---');
  await makeRequest('/notifications/preferences/type', 'PUT', {
    notificationType: 'productUpdates',
    push: true,
    enabled: true,
  });

  // Test 2.4: Invalid notification type (should fail)
  console.log('\n--- Test 2.4: Invalid notification type (should fail) ---');
  await makeRequest('/notifications/preferences/type', 'PUT', {
    notificationType: 'invalidType',
    email: false,
  });
}

// ============================================
// TEST 3: Update Global Settings
// ============================================
async function testUpdateGlobalSettings() {
  console.log('\n========== TEST 3: Update Global Settings ==========');

  // Test 3.1: Enable quiet hours
  console.log('\n--- Test 3.1: Enable quiet hours ---');
  await makeRequest('/notifications/preferences/global', 'PUT', {
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
  });

  // Test 3.2: Switch to daily digest
  console.log('\n--- Test 3.2: Switch to daily digest mode ---');
  await makeRequest('/notifications/preferences/global', 'PUT', {
    frequency: 'daily_digest',
  });

  // Test 3.3: Enable do not disturb
  console.log('\n--- Test 3.3: Enable do not disturb ---');
  await makeRequest('/notifications/preferences/global', 'PUT', {
    doNotDisturb: true,
  });

  // Test 3.4: Invalid time format (should fail)
  console.log('\n--- Test 3.4: Invalid time format (should fail) ---');
  await makeRequest('/notifications/preferences/global', 'PUT', {
    quietHoursStart: '25:00', // Invalid
  });

  // Test 3.5: Disable sound
  console.log('\n--- Test 3.5: Disable sound ---');
  await makeRequest('/notifications/preferences/global', 'PUT', {
    soundEnabled: false,
  });
}

// ============================================
// TEST 4: Get Preferences Summary
// ============================================
async function testGetSummary() {
  console.log('\n========== TEST 4: Get Preferences Summary ==========');
  return await makeRequest('/notifications/preferences/summary');
}

// ============================================
// TEST 5: Update All Preferences
// ============================================
async function testUpdateAllPreferences() {
  console.log('\n========== TEST 5: Update All Preferences ==========');

  const newPreferences = {
    orderPlaced: {
      enabled: true,
      email: true,
      push: true,
      inApp: true,
    },
    orderUpdated: {
      enabled: true,
      email: true,
      push: true,
      inApp: true,
    },
    orderCancelled: {
      enabled: true,
      email: true,
      push: false,
      inApp: true,
    },
    orderDelivered: {
      enabled: true,
      email: true,
      push: true,
      inApp: true,
    },
    systemAlert: {
      enabled: true,
      email: true,
      push: true,
      inApp: true,
    },
    productUpdates: {
      enabled: false, // Disabled
      email: false,
      push: true,
      inApp: true,
    },
  };

  return await makeRequest('/notifications/preferences/all', 'PUT', {
    preferences: newPreferences,
  });
}

// ============================================
// TEST 6: Reset Preferences
// ============================================
async function testResetPreferences() {
  console.log('\n========== TEST 6: Reset Preferences to Defaults ==========');
  return await makeRequest('/notifications/preferences/reset', 'POST');
}

// ============================================
// RUN ALL TESTS
// ============================================
async function runAllTests() {
  console.log('\n\n');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  ADMIN NOTIFICATION ENDPOINTS TEST SUITE                   ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  try {
    // Run tests sequentially
    await testGetPreferences();
    await testUpdateNotificationType();
    await testUpdateGlobalSettings();
    await testGetSummary();
    await testUpdateAllPreferences();
    // Uncomment to test reset
    // await testResetPreferences();

    console.log('\n\n✅ All tests completed!');
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Export for use in Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testGetPreferences,
    testUpdateNotificationType,
    testUpdateGlobalSettings,
    testGetSummary,
    testUpdateAllPreferences,
    testResetPreferences,
    runAllTests,
  };
}

// Uncomment to run automatically
// runAllTests();
