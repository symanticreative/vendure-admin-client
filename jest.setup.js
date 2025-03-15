// Suppress console.error during tests to avoid cluttering the output
// These errors are intentional in error handling tests
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});
