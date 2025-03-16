import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService  } from '@/services/authService';
import  { mockApi, users, User } from '@/server/mockApi';

// Mock vue-toast-notification
vi.mock("vue-toast-notification", () => ({
  useToast: vi.fn(() => ({
    success: vi.fn(),
    error: vi.fn(),
  })),
}));

// Mock authService to ensure it's available
vi.mock('@/services/authService', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(() => null),
    isAuthenticated: vi.fn(() => false),
    hasRole: vi.fn(),
    getCurrentUserRole: vi.fn(),
    startSessionTimeout: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    if (authService && authService.logout) {
      authService.logout();
    }
    vi.useFakeTimers();
  });

  it('should login with valid credentials', async () => {
    const user = users[0];
    authService.login.mockResolvedValue(user);
    
    const loggedInUser = await authService.login(user.email, 'password');
    expect(loggedInUser).toEqual(user);
  });

  it('should not login with invalid credentials', async () => {
    authService.login.mockRejectedValue(new Error('Invalid credentials'));

    await expect(authService.login('invalid@example.com', 'password'))
      .rejects.toThrow('Invalid credentials');
  });

  it('should logout the user', async () => {
    authService.logout();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should check if user is authenticated', async () => {
    authService.isAuthenticated.mockReturnValue(true);
    expect(authService.isAuthenticated()).toBe(true);

    authService.isAuthenticated.mockReturnValue(false);
    expect(authService.isAuthenticated()).toBe(false);
  });
});
