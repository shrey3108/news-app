const server = require('../server');

describe('Server Configuration', () => {
  test('Server should be defined', () => {
    expect(server).toBeDefined();
  });

  test('Environment variables are set', () => {
    expect(process.env.PORT).toBeDefined();
  });
});
