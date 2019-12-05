module.exports = {
  rootDir: '.',
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testURL: 'http://localhost/',
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
  ],
  collectCoverageFrom: ['<rootDir>/src/**/*.{js,ts}'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/test-helpers/',
    '/testing/',
    '/specs/',
    '/tests/',
  ],
  coverageReporters: ['lcov', 'text-summary'],
  verbose: true,
  preset: 'ts-jest',
};
