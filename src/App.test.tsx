import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import App from './App';

describe('App', () => {
    
    beforeEach(() => {
        const mockThings = {
            things_stored: JSON.stringify({
                1: { id: 1, title: 'Thing 1', price: 1000, completed: false },
                2: { id: 2, title: 'Thing 2', price: 2000, completed: true },
            }),
            timestamp: '1741989940',
        };

        const getResponse = { json: () => Promise.resolve(mockThings) } as Response;
        global.fetch = vi.fn(() => Promise.resolve(getResponse));
    });

    it('renders the App component', async () => {
        await act(() => render(<App />));
    });

    it('displays loading gif initially', async () => {
        render(<App />);

        expect(screen.getByAltText('Loading...')).toBeInTheDocument();
        await waitFor(() => expect(screen.queryByAltText('Loading...')).not.toBeInTheDocument());
    });

    it('fetches and displays things', async () => {
        render(<App />);

        await waitFor(() => expect(screen.getByText('Thing 1')).toBeInTheDocument());
        expect(screen.getByText('Thing 2')).toBeInTheDocument();
    });

    it('adds a new thing', async () => {
        global.fetch = vi.fn((_, options) => {
            if (options?.method === 'POST') {
                const mockNewThing = { id: 3, title: 'Thing 3', price: 3000, completed: false  };
                const postResponse = { ok: true, json: () => Promise.resolve(mockNewThing) } as Response;
                return Promise.resolve(postResponse);
            }

            const getResponseObject = { things_stored: '{}', timestamp: '' };
            const getResponse = { json: () => Promise.resolve(getResponseObject) } as Response;
            return Promise.resolve(getResponse);
        });

        render(<App />);

        fireEvent.change(screen.getByPlaceholderText('Enter title'), { target: { value: 'Thing 3' } });
        fireEvent.change(screen.getByPlaceholderText('Enter price'), { target: { value: '30.00' } });
        fireEvent.click(screen.getByText('Add Thing'));

        await waitFor(() => expect(screen.getByText('Thing 3')).toBeInTheDocument());
    });

    it('deletes a thing', async () => {
        await act(() => render(<App />));
        
        const deleteButton = await waitFor(() => screen.getByTestId('delete-thing-1'));
        fireEvent.click(deleteButton);

        await waitFor(() => expect(screen.queryByText('Thing 1')).not.toBeInTheDocument());
    });

});
