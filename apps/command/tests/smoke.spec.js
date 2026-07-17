const { test, expect } = require('@playwright/test');

const pages = [
  '/mesh/nodes',
  '/mesh/security',
  '/mesh/reputation',
  '/mesh/governance',
  '/mesh/routing',
  '/mesh/health',
  '/mesh/load',
  '/mesh/insights',
  '/mesh/autonomy'
];

test.describe('Command App Smoke Tests', () => {
  for (const page of pages) {
    test(`Page ${page} loads and renders correctly`, async ({ page: p }) => {
      // Mock the local storage JWT
      await p.addInitScript(() => {
        window.localStorage.setItem('nodl_jwt', 'test-token');
      });

      // Intercept API calls to prevent failures on missing backend during frontend test
      await p.route('**/api/mesh/**', async route => {
        await route.fulfill({ status: 200, json: { nodes: [], states: {}, events: [] } });
      });

      const res = await p.goto(`http://localhost:3001${page}`, { waitUntil: 'networkidle' });
      expect(res.ok()).toBeTruthy();

      // Ensure no obvious crash boundary
      const bodyText = await p.locator('body').innerText();
      expect(bodyText).not.toContain('Application error: a client-side exception has occurred');
      
      // Ensure at least some data state appears (e.g. "No nodes" or a table element)
      const table = p.locator('table');
      const count = await table.count();
      if (count === 0) {
        // Fallback: look for generic error/no-data text
        expect(bodyText.toLowerCase()).toMatch(/no nodes|loading|no data|0/);
      } else {
        expect(count).toBeGreaterThan(0);
      }
    });
  }
});
