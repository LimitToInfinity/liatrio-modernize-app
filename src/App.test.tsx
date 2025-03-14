import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import App from './App';

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('App Component', () => {
  test('renders the App component', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ things_stored: '{}', timestamp: '' }));

    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText('Liatrio Modernize It')).toBeInTheDocument();
    expect(screen.getByText('Things')).toBeInTheDocument();
  });

  test('handles form input and submission', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ things_stored: '{}', timestamp: '' }));
    fetchMock.mockResponseOnce(JSON.stringify({ id: 1, title: 'New Thing', price: 123456, completed: false }));

    await act(async () => {
      render(<App />);
    });

    const titleInput = screen.getByPlaceholderText('Enter title');
    const priceInput = screen.getByPlaceholderText('Enter price');
    const addButton = screen.getByText('Add Thing');

    fireEvent.change(titleInput, { target: { value: 'New Thing' } });
    fireEvent.change(priceInput, { target: { value: '1234.56' } });

    expect(titleInput).toHaveValue('New Thing');
    expect(priceInput).toHaveValue('1234.56');

    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('New Thing')).toBeInTheDocument();
      expect(screen.getByText('Price $1,234.56')).toBeInTheDocument();
    });
  });

  test('displays toast message for price exceeding limit', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ things_stored: '{}', timestamp: '' }));

    await act(async () => {
      render(<App />);
    });

    const priceInput = screen.getByPlaceholderText('Enter price');
    const addButton = screen.getByText('Add Thing');

    fireEvent.change(priceInput, { target: { value: '21474836.48' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Price cannot exceed 21,474,836.47')).toBeInTheDocument();
    });
  });
});
