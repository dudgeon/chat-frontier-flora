module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@chat-frontier-flora/shared': '<rootDir>/../../packages/shared/src',
    '^react-native$': 'react-native-web',
    '^@testing-library/react-native$': '@testing-library/react'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native-web|@supabase)/)'
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/setupTests.ts'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/src/components/auth/SignUpForm.test.tsx',
    '<rootDir>/src/components/auth/ProtectedRoute.test.tsx'
  ]
};
