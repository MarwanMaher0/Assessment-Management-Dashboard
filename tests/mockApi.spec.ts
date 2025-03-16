import { describe, it, expect, beforeEach } from 'vitest';
import { mockApi, users, User } from '@/server/mockApi';

describe('mockApi', () => {
  let user: User;

  beforeEach(() => {
    user = {
      id: users.length + 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      age: 30,
      dob: '1992-01-01',
      isActive: true,
      role: 'viewer',
    };
  });

  it('should fetch users', async () => {
    const response = await mockApi.getUsers({ page: 1, limit: 10 });
    expect(response.data).toHaveLength(10);
    expect(response.total).toBe(users.length);
  });

  it('should fetch a user by ID', async () => {
    const fetchedUser = await mockApi.getUser(1);
    expect(fetchedUser).toEqual(users[0]);
  });

  it('should create a new user', async () => {
    const newUser = await mockApi.createUser(user);
    expect(newUser).toEqual({ ...user, id: users.length });
    const response = await mockApi.getUsers({ page: 1, limit: 100 });
    expect(response.data).toContainEqual(newUser);
  });

  it('should update a user', async () => {
    const updates = { firstName: 'Updated' };
    const updatedUser = await mockApi.updateUser(1, updates);
    expect(updatedUser.firstName).toBe('Updated');
    const fetchedUser = await mockApi.getUser(1);
    expect(fetchedUser.firstName).toBe('Updated');
  });

  it('should delete a user', async () => {
    try {
      const result = await mockApi.deleteUser(1);
      expect(result.success).toBe(true);
  
      const response = await mockApi.getUsers({ page: 1, limit: 100 });
      console.log('Fetched users after deletion:', response);
  
      const userExists = response.data.some(user => user.id === 1);
      expect(userExists).toBe(false);
    } catch (error) {
      console.error('Error in deleteUser test:', error);
      throw error;
    }
  });
  
  
});
