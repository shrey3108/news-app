/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  verbose: true,
  passWithNoTests: true,
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['**/*.js', '!**/node_modules/**'],
  transform: {},
  moduleNameMapper: {
    '^(\.{1,2}/.*)\.js$': '$1'
  }
};
