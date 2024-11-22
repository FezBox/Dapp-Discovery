class AuthService {
    constructor() {
        this.apiBaseUrl = 'https://api.yourdappapi.com';
        this.useApi = false;
        this.currentUser = null;
        this.authListeners = new Set();
    }

    async init() {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                await this.validateToken(token);
            } catch (error) {
                console.error('Invalid token:', error);
                this.logout();
            }
        }
    }

    async login(email, password) {
        if (this.useApi) {
            try {
                const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (!response.ok) throw new Error('Login failed');

                const data = await response.json();
                this.setSession(data);
                return data;
            } catch (error) {
                console.error('Login error:', error);
                throw error;
            }
        } else {
            // Mock authentication for development
            if (email === 'demo@example.com' && password === 'demo123') {
                const mockUser = {
                    id: '1',
                    email: 'demo@example.com',
                    name: 'Demo User',
                    token: 'mock-jwt-token'
                };
                this.setSession(mockUser);
                return mockUser;
            }
            throw new Error('Invalid credentials');
        }
    }

    async register(email, password, name) {
        if (this.useApi) {
            try {
                const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password, name }),
                });

                if (!response.ok) throw new Error('Registration failed');

                const data = await response.json();
                this.setSession(data);
                return data;
            } catch (error) {
                console.error('Registration error:', error);
                throw error;
            }
        } else {
            // Mock registration
            const mockUser = {
                id: Date.now().toString(),
                email,
                name,
                token: 'mock-jwt-token'
            };
            this.setSession(mockUser);
            return mockUser;
        }
    }

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.currentUser = null;
        this.notifyAuthListeners();
    }

    async validateToken(token) {
        if (this.useApi) {
            try {
                const response = await fetch(`${this.apiBaseUrl}/auth/validate`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error('Invalid token');
                const userData = await response.json();
                this.currentUser = userData;
                this.notifyAuthListeners();
                return userData;
            } catch (error) {
                console.error('Token validation error:', error);
                throw error;
            }
        } else {
            // Mock token validation
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData) {
                this.currentUser = userData;
                this.notifyAuthListeners();
                return userData;
            }
            throw new Error('Invalid token');
        }
    }

    setSession(userData) {
        localStorage.setItem('authToken', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        this.currentUser = userData;
        this.notifyAuthListeners();
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    addAuthListener(listener) {
        this.authListeners.add(listener);
    }

    removeAuthListener(listener) {
        this.authListeners.delete(listener);
    }

    notifyAuthListeners() {
        this.authListeners.forEach(listener => listener(this.currentUser));
    }
}

export const authService = new AuthService();
