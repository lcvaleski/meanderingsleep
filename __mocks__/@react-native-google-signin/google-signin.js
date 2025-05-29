export const GoogleSignin = {
  configure: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getCurrentUser: jest.fn(),
  hasPlayServices: jest.fn(),
  isSignedIn: jest.fn(),
};

export const User = {
  id: 'mock-user-id',
  email: 'mock@example.com',
  name: 'Mock User',
  photo: 'mock-photo-url',
}; 