class ApiClient {
    constructor(baseURL = 'https://blync.onrender.com/api/auth/login') {
        this.baseURL = baseURL;
    }

    // Método genérico para fazer requisições
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            credentials: 'include'
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    // Método para requisições autenticadas
    async authenticatedRequest(endpoint, options = {}) {
        const token = localStorage.getItem('blync_token');
        
        if (!token) {
            throw new Error('Usuário não autenticado');
        }

        const authOptions = {
            ...options,
            headers: {
                'Authorization': `Bearer ${token}`,
                ...options.headers
            }
        };

        return this.request(endpoint, authOptions);
    }

    // Métodos específicos para Auth
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    async getProfile() {
        return this.authenticatedRequest('/auth/profile');
    }

    async updateProfile(profileData) {
        return this.authenticatedRequest('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    // Métodos para o Chatbot
    async sendChatMessage(message, userId = null) {
        return this.authenticatedRequest('/chatbot/message', {
            method: 'POST',
            body: JSON.stringify({
                message,
                userId: userId || this.getUserId()
            })
        });
    }

    async getChatHistory(userId = null) {
        const endpoint = userId ? `/chatbot/history/${userId}` : '/chatbot/history';
        return this.authenticatedRequest(endpoint);
    }

    // Utilitários
    getUserId() {
        const userStr = localStorage.getItem('blync_user');
        if (userStr) {
            const user = JSON.parse(userStr);
            return user.id;
        }
        return null;
    }

    isAuthenticated() {
        return !!localStorage.getItem('blync_token');
    }

    logout() {
        localStorage.removeItem('blync_token');
        localStorage.removeItem('blync_user');
        window.location.href = '/';
    }
}

// Instância global
window.apiClient = new ApiClient();