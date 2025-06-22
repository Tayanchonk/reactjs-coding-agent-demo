/** @type {import('jest').Config} */
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        module: 'CommonJS',
        verbatimModuleSyntax: false,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        jsx: 'react-jsx',
        skipLibCheck: true,
        noImplicitAny: false,
      },
      diagnostics: {
        ignoreCodes: [2339], // Ignore "Property does not exist" errors for jest-dom matchers
      },
    }],
  },
};