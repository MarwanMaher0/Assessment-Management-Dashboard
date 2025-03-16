import { User, users } from '../server/mockApi';
import { useToast } from "vue-toast-notification";

const toast = useToast({
    position: 'top-right'
});


let currentUser: User | null = null;
let sessionTimeout: number | null = null;

export const authService = {
    login: async (email: string, password: string) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = users.find(u => u.email === email);
                if (user) {
                    currentUser = user;
                    authService.startSessionTimeout();
                    toast.success('Login successful');
                    resolve(user);
                } else {
                    toast.error('Invalid credentials');
                    reject(new Error('Invalid credentials'));
                }
            }, 500);
        });
    },

    logout: () => {
        currentUser = null;
        if (sessionTimeout) {
            clearTimeout(sessionTimeout);
        }
    },

    getCurrentUser: () => {
        return currentUser;
    },

    isAuthenticated: () => {
        return currentUser !== null;
    },

    hasRole: (role: string) => {
        return currentUser?.role === role;
    },

    getCurrentUserRole: () => {
        return currentUser?.role || null;
    },

    startSessionTimeout: () => {
        if (sessionTimeout) {
            clearTimeout(sessionTimeout);
        }
        sessionTimeout = window.setTimeout(() => {
            authService.logout();
            alert('Session timed out. Please log in again.');
        }, 30 * 60 * 1000); // 30 minutes
    }
};
