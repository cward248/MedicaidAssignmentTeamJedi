// js how to generate stress test of multiple applicants
// Calis Ward

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 },   // Ramp up to 100 users
    { duration: '1m', target: 1000 },    // Ramp to 1000 users
    { duration: '2m', target: 5000 },    // Ramp to 5000 users
    { duration: '2m', target: 10000 },   // Ramp to 10000 users
    { duration: '1m', target: 0 },       // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests < 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% failure rate
  },
};

export default function () {
  // Test form submission endpoint
  const formPayload = JSON.stringify({
    employer_name: `Stress Test Co ${__VU}`,
    job_title: 'Tester',
    monthly_hours_worked: 40,
    employment_status: 'Full-time',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Test GET request to verify page
  let getRes = http.get('http://localhost:3000/verify');
  check(getRes, {
    'verify page loaded': (r) => r.status === 200,
  });

  // Test POST to submit application
  let postRes = http.post('http://localhost:3000/api/applications', formPayload, params);
  check(postRes, {
    'application submitted': (r) => r.status === 200 || r.status === 201,
  });

  sleep(1);
} // Run with: k6 run stress-test.js