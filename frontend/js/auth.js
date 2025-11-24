class AuthManager {
    constructor() {
        this.baseURL = 'http://localhost:3333/api/auth';
        this.tokenKey = 'blync_token';
        this.userKey = 'blync_user';
        
        this.init();
    }
    
    init() {
        // Verificar se usuário já está logado
        this.checkAuthState();
        
        // Configurar event listeners para formulários
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Formulário de login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Formulário de registro
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
        
        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }
    
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');
        
        // Validar campos
        if (!email || !password) {
            this.showAlert('Por favor, preencha todos os campos', 'error');
            return;
        }
        
        // Mostrar loading
        this.setButtonLoading(submitBtn, true);
        
        try {
            const response = await fetch(`${this.baseURL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Salvar token e dados do usuário
                this.setAuthData(data.data.token, data.data.user);
                
                this.showAlert('Login realizado com sucesso!', 'success');
                
                // Redirecionar para a página inicial após 1 segundo
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
                
            } else {
                this.showAlert(data.error || 'Erro no login', 'error');
            }
            
        } catch (error) {
            console.error('Erro no login:', error);
            this.showAlert('Erro de conexão. Tente novamente.', 'error');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }
    
    async handleRegister(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        
        // Validar campos obrigatórios
        if (!data.firstName || !data.email || !data.password || !data.confirmPassword) {
            this.showAlert('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        // Validar senhas
        if (data.password !== data.confirmPassword) {
            this.showAlert('As senhas não coincidem', 'error');
            return;
        }
        
        // Validar termos
        if (!data.terms) {
            this.showAlert('Você deve aceitar os termos de uso', 'error');
            return;
        }
        
        // Mostrar loading
        this.setButtonLoading(submitBtn, true);
        
        try {
            const response = await fetch(`${this.baseURL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: `${data.firstName} ${data.lastName || ''}`.trim(),
                    email: data.email,
                    password: data.password
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Salvar token e dados do usuário
                this.setAuthData(result.data.token, result.data.user);
                
                this.showAlert('Conta criada com sucesso!', 'success');
                
                // Redirecionar para a página inicial após 1 segundo
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
                
            } else {
                this.showAlert(result.error || 'Erro no cadastro', 'error');
            }
            
        } catch (error) {
            console.error('Erro no cadastro:', error);
            this.showAlert('Erro de conexão. Tente novamente.', 'error');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }
    
    handleLogout() {
        this.clearAuthData();
        this.showAlert('Logout realizado com sucesso', 'success');
        
        // Redirecionar para a página inicial
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    }
    
    setAuthData(token, user) {
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.updateUIForAuthState(true, user);
    }
    
    clearAuthData() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.updateUIForAuthState(false);
    }
    
    getAuthData() {
        const token = localStorage.getItem(this.tokenKey);
        const userStr = localStorage.getItem(this.userKey);
        const user = userStr ? JSON.parse(userStr) : null;
        
        return { token, user };
    }
    
    isAuthenticated() {
        const { token, user } = this.getAuthData();
        return !!(token && user);
    }
    
    checkAuthState() {
        const { token, user } = this.getAuthData();
        
        if (token && user) {
            this.updateUIForAuthState(true, user);
            return true;
        } else {
            this.updateUIForAuthState(false);
            return false;
        }
    }
    
    updateUIForAuthState(isAuthenticated, user = null) {
        // Atualizar navbar
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
            if (isAuthenticated && user) {
                navActions.innerHTML = `
                    <div class="user-menu">
                        <span>Olá, ${user.name.split(' ')[0]}</span>
                        <div class="dropdown">
                            <button class="btn btn-outline" id="userDropdown">
                                <i class="fas fa-user"></i>
                            </button>
                            <div class="dropdown-content">
                                <a href="/profile">Meu Perfil</a>
                                <a href="#" id="logoutBtn">Sair</a>
                            </div>
                        </div>
                    </div>
                `;
                
                // Re-adicionar event listener para logout
                setTimeout(() => {
                    const logoutBtn = document.getElementById('logoutBtn');
                    if (logoutBtn) {
                        logoutBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            this.handleLogout();
                        });
                    }
                }, 100);
            } else {
                navActions.innerHTML = `
                    <a href="/login" class="btn btn-outline">Entrar</a>
                    <a href="/register" class="btn btn-primary">Abrir Conta</a>
                `;
            }
        }
        
        // Redirecionar se tentar acessar login/registro já logado
        if (isAuthenticated && (window.location.pathname === '/login' || window.location.pathname === '/register')) {
            setTimeout(() => {
                window.location.href = '/';
            }, 100);
        }
    }
    
    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        } else {
            button.disabled = false;
            if (button.closest('#loginForm')) {
                button.innerHTML = '<i class="fas fa-sign-in-alt"></i> Entrar na Conta';
            } else if (button.closest('#registerForm')) {
                button.innerHTML = '<i class="fas fa-user-plus"></i> Criar Minha Conta';
            }
        }
    }
    
    showAlert(message, type = 'info') {
        // Remover alertas anteriores
        const existingAlert = document.querySelector('.auth-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Criar novo alerta
        const alert = document.createElement('div');
        alert.className = `auth-alert auth-alert-${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas fa-${this.getAlertIcon(type)}"></i>
                <span>${message}</span>
                <button class="alert-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Adicionar ao documento
        const mainContent = document.querySelector('.auth-card') || document.querySelector('.hero') || document.body;
        if (mainContent) {
            mainContent.parentNode.insertBefore(alert, mainContent);
        }
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }
    
    getAlertIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    // Método para fazer requisições autenticadas
    async authenticatedFetch(url, options = {}) {
        const { token } = this.getAuthData();
        
        if (!token) {
            throw new Error('Usuário não autenticado');
        }
        
        const defaultOptions = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        };
        
        return fetch(url, { ...defaultOptions, ...options });
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});