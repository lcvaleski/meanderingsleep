/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

// Mock React Native
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.InteractionManager = {
    createInteractionHandle: jest.fn(() => 1),
    clearInteractionHandle: jest.fn(),
    runAfterInteractions: jest.fn(callback => callback()),
  };
  return RN;
});

test('renders correctly', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });

  // Clean up
  await ReactTestRenderer.act(async () => {
    renderer!.unmount();
    // Wait for any pending animations
    await new Promise(resolve => setTimeout(resolve, 0));
  });
});
