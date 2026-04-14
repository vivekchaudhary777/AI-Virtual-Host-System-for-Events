import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

jest.mock('./services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

test('renders app title', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  const titleElement = screen.getByText(/Virtual Event Platform/i);
  expect(titleElement).toBeInTheDocument();
});
