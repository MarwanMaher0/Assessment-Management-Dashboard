import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAppStore } from "@/stores/index";
import { mockApi, users, User } from '@/server/mockApi';

// Mock mockApi methods
vi.mock('@/server/mockApi', () => ({
  mockApi: {
    getUsers: vi.fn(),
    addUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  },
  users: [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', age: 30, dob: '1993-01-01', isActive: true, role: 'admin' },
    { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', age: 28, dob: '1995-01-01', isActive: true, role: 'editor' },
  ],
}));

describe('userStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should fetch users and update the store', async () => {
    const userStore = useAppStore();
    mockApi.getUsers.mockResolvedValue(users);
    await userStore.fetchUsers();
    expect(userStore.users).toHaveLength(users.length);
  });

  it('should add a new user to the store', async () => {
    const userStore = useAppStore();
    const newUser = {
      id: users.length + 1,
      firstName: 'New',
      lastName: 'User',
      email: 'newuser@example.com',
      age: 25,
      dob: '1997-01-01',
      isActive: true,
      role: 'viewer',
    };
    mockApi.addUser.mockResolvedValue(newUser);
    await userStore.addUser(newUser);
    expect(userStore.users).toContainEqual(newUser);
  });

  it('should update a user in the store', async () => {
    const userStore = useAppStore();
    const updates = { firstName: 'Updated' };
    const updatedUser = { ...users[0], ...updates };
    mockApi.updateUser.mockResolvedValue(updatedUser);
    await userStore.updateUser(1, updates);
    const user = userStore.users.find(user => user.id === 1);
    expect(user.firstName).toBe('Updated');
  });

  it('should delete a user from the store', async () => {
    const userStore = useAppStore();
    mockApi.deleteUser.mockResolvedValue();
    await userStore.deleteUser(1);
    const userExists = userStore.users.some(user => user.id === 1);
    expect(userExists).toBe(false);
  });
});
