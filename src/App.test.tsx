import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import App from './App';

describe('App', () => {

  it('renders the App component', () => {
    render(<App />);
  });

  it('displays loading gif initially', () => {
    render(<App />);
    expect(screen.getByAltText('Loading...')).toBeInTheDocument();
  });

  it('fetches and displays things', async () => {
    const mockThings = {
      things_stored: JSON.stringify({
        1: { id: 1, title: 'Thing 1', price: 1000, completed: false },
        2: { id: 2, title: 'Thing 2', price: 2000, completed: true },
      }),
      timestamp: '2023-10-01T00:00:00Z',
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockThings),
      } as Response)
    );

    render(<App />);

    await waitFor(() => expect(screen.getByText('Thing 1')).toBeInTheDocument());
    expect(screen.getByText('Thing 2')).toBeInTheDocument();
  });

  it('adds a new thing', async () => {
    const mockNewThing = { id: 3, title: 'Thing 3', price: 3000, completed: false };

    global.fetch = vi.fn((_, options) => {
      if (options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockNewThing),
        } as Response);
      }
      return Promise.resolve({
        json: () => Promise.resolve({ things_stored: '{}', timestamp: '' }),
      } as Response);
    });

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Enter title'), { target: { value: 'Thing 3' } });
    fireEvent.change(screen.getByPlaceholderText('Enter price'), { target: { value: '30.00' } });
    fireEvent.click(screen.getByText('Add Thing'));

    await waitFor(() => expect(screen.getByText('Thing 3')).toBeInTheDocument());
  });

});
