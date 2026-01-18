import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

const isBrowserTest = process.argv.some(arg => arg.includes('--browser'));

export default defineConfig({
  test: {
    include: isBrowserTest
      ? [
          'test/parser.test.ts',
          'test/formatter.test.ts',
          'test/validator.test.ts',
          'test/whatwg_stream.test.ts'
        ]
      : ['test/**/*.test.ts'],
    browser: {
      enabled: isBrowserTest,
      provider: playwright(),
      instances: [
        { browser: 'chromium' },
        { browser: 'firefox' },
        { browser: 'webkit' }
      ],
      headless: true
    }
  }
});
