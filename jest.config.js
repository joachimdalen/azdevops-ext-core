module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|ts|tsx|jsx)$': 'ts-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(azure-devops-ui|azure-devops-extension-sdk|azure-devops-extension-api)/)'
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': '<rootDir>/src/__mocks__/styleMock.js'
  },
  preset: 'ts-jest/presets/js-with-babel',
  testResultsProcessor: './node_modules/jest-junit-reporter',
  collectCoverageFrom: ['src/**', '!src/__test-utils__/*', '!src/**/*.json'],
  coverageReporters: ['json', 'html', 'cobertura']
};
