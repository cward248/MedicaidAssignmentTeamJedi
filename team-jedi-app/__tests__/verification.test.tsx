// npm install --save-dev @testing-library/react @testing-library/jest-dom jest @types/jest
// c ward unit tests for verification page

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VerifyPage from '../app/verify/page';

// Mock Supabase
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ 
            data: mockApplications, 
            error: null 
          }))
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null }))
      }))
    })),
    storage: {
      from: jest.fn(() => ({
        getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'test-url' } }))
      }))
    }
  }
}));

const mockApplications = [
  {
    id: '1',
    employer_name: 'Test Company',
    job_title: 'Software Engineer',
    monthly_hours_worked: 40,
    employment_status: 'Full-time',
    document_url: 'test.pdf',
    verification_status: 'pending',
    created_at: '2024-01-01T00:00:00Z'
  }
];

describe('Verification Page', () => {
  it('renders pending applications list', async () => {
    render(<VerifyPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Company')).toBeInTheDocument();
    });
  });

  it('displays application details when selected', async () => {
    render(<VerifyPage />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Test Company'));
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });
  });

  it('shows approve and reject buttons for verification', async () => {
    render(<VerifyPage />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Test Company'));
      expect(screen.getByText('✓ Approve')).toBeInTheDocument();
      expect(screen.getByText('✗ Reject')).toBeInTheDocument();
    });
  });
});