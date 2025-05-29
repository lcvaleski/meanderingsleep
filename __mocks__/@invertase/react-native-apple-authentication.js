export const AppleButton = jest.fn(() => null);

export const appleAuth = {
  performRequest: jest.fn(),
  getCredentialStateForUser: jest.fn(),
  isSupported: jest.fn(),
  isSignUpButtonSupported: jest.fn(),
  getRealUserStatus: jest.fn(),
}; 