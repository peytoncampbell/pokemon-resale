module.exports = {
  ci: {
    collect: {
      // Build output directory for Next.js
      staticDistDir: './.next',
      // Number of runs per URL (more runs = more accurate)
      numberOfRuns: 3,
      // URLs to test (use localhost for static exports or production URLs)
      url: [
        'http://localhost:3000',
        'http://localhost:3000/inventory',
        'http://localhost:3000/transactions',
        'http://localhost:3000/reports',
      ],
      settings: {
        // Performance optimizations for CI
        preset: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
        // Skip tests that require authentication
        skipAudits: [
          'uses-http2',
          'redirects-http',
        ],
      },
    },
    assert: {
      // Performance thresholds
      assertions: {
        'categories:performance': ['error', { minScore: 0.7 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.8 }],
        'categories:seo': ['error', { minScore: 0.8 }],
        // Specific performance metrics
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
      },
    },
    upload: {
      // Store results temporarily (can be replaced with permanent storage)
      target: 'temporary-public-storage',
    },
  },
};
