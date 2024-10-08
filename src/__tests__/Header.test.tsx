import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import mockRouter from 'next-router-mock';
import { AuthProvider } from '@/context/AuthContext';

import { useAuth } from '@/context/AuthContext';
import Header from '@/components/header/Header';

vi.mock('@/context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useAuth: vi.fn(),
  };
});

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: unknown) => key,
  }),
  initReactI18next: {
    use: () => {},
    init: () => {},
  },
}));

describe('Header', () => {
  const renderWithAuth = () => {
    return render(
      <AuthProvider>
        <Header />
      </AuthProvider>,
      { wrapper: MemoryRouterProvider }
    );
  };

  it('should show the correct header when the user is logged in', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { uid: '123' },
      name: 'John Doe',
      isLoading: false,
    });

    await act(async () => {
      renderWithAuth();
    });
    expect(screen.getByText(/logOut/i)).toBeInTheDocument();
    expect(screen.getByText(/main/i)).toBeInTheDocument();
    expect(screen.getByText(/REST\/Graph/i)).toBeInTheDocument();
    expect(screen.getByText(/rus/i)).toBeInTheDocument();
  });
  it('should show the correct header when the user is not logged in', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      name: null,
      isLoading: false,
    });

    await act(async () => {
      renderWithAuth();
    });
    expect(screen.getByText(/signUp/i)).toBeInTheDocument();
    expect(screen.getByText(/signIn/i)).toBeInTheDocument();
    expect(screen.getByText(/REST\/Graph/i)).toBeInTheDocument();
    expect(screen.getByText(/rus/i)).toBeInTheDocument();
  });
  it('should change url on click', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      name: null,
      isLoading: false,
    });

    await act(async () => {
      renderWithAuth();
    });
    expect(screen.getByText(/signUp/i)).toBeInTheDocument();
    expect(screen.getByText(/signIn/i)).toBeInTheDocument();
    expect(screen.getByText(/rus/i)).toBeInTheDocument();
    await waitFor(() => {
      fireEvent.click(screen.getByText(/signUp/i));
      expect(mockRouter).toMatchObject({
        pathname: '/auth/sign-up',
      });
    });
  });
});
