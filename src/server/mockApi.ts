export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    dob: string;
    isActive: boolean;
    role: string;
}

export const users: User[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    firstName: `FirstName ${i + 1}`,
    lastName: `LastName ${i + 1}`,
    email: `user${i + 1}@example.com`,
    age: 20 + (i % 30),
    dob: `199${i % 10}-0${(i % 9) + 1}-1${i % 9}`,
    isActive: i % 2 === 0,
    role: i % 3 === 0 ? 'admin' : i % 3 === 1 ? 'manager' : 'viewer',
}));

const roles = ['admin', 'manager', 'viewer'];

function simulateLatency(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 500));
}

function simulateFailure(): boolean {
    return Math.random() < 0.05; // Reduced failure rate
}

export const mockApi = {
    async getUsers({ page = 1, limit = 10, search = '', sort = 'id' }: { page?: number; limit?: number; search?: string; sort?: string }) {
        await simulateLatency();
        if (simulateFailure()) throw new Error('Failed to fetch users');
        let filtered = users.filter((u) => 
            u.firstName.includes(search) || 
            u.lastName.includes(search) || 
            u.email.includes(search)
        );
        filtered = filtered.sort((a, b) => (a[sort as keyof User] > b[sort as keyof User] ? 1 : -1));
        const paginated = filtered.slice((page - 1) * limit, page * limit);
        return { data: paginated, total: filtered.length };
    },

    async getUser(id: number) {
        await simulateLatency();
        if (simulateFailure()) throw new Error('Failed to fetch user');
        const user = users.find((u) => u.id === id);
        if (!user) throw new Error('User not found');
        return user;
    },

    async updateUser(id: number, updates: Partial<User>) {
        await simulateLatency();
        if (simulateFailure()) throw new Error('Failed to update user');
        const userIndex = users.findIndex((u) => u.id === id);
        if (userIndex === -1) throw new Error('User not found');
        users[userIndex] = { ...users[userIndex], ...updates };
        return users[userIndex];
    },

    async createUser(newUser: Omit<User, 'id'>) {
        await simulateLatency();
        if (simulateFailure()) throw new Error('Failed to create user');
        const id = users.length + 1;
        const user = { id, ...newUser };
        users.push(user);
        return user;
    },

    async deleteUser(id: number) {
        await simulateLatency();
        if (simulateFailure()) throw new Error('Failed to delete user');
        const index = users.findIndex((u) => u.id === id);
        if (index === -1) throw new Error('User not found');
        users.splice(index, 1);
        return { success: true };
    },

    async getRoles() {
        await simulateLatency();
        return roles;
    },
};

export default mockApi;