import { render, screen } from '@testing-library/react';

import App from './App';

test('renders controls', () => {
  render(<App />);

  const sexLabel = screen.getByText('Sex');
  const yearLabel = screen.getByText('Year');

  expect(sexLabel).toBeInTheDocument();
  expect(yearLabel).toBeInTheDocument();
})
