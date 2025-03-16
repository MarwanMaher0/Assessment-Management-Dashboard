export declare const authService: {
  login(email: string, password: string): Promise<any>;
  logout(): void;
  getCurrentUser(): any;
  isAuthenticated(): boolean;
  hasRole(role: string): boolean;
  getCurrentUserRole(): string;
  startSessionTimeout(): void;
};
