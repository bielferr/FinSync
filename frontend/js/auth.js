class AuthManager {
    constructor() {
        this.baseURL = 'https://blync.onrender.com/api/auth';
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
        
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;
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
            
            // Verificar se a resposta é JSON válido
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Resposta do servidor não é JSON válido');
            }
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                // Salvar token e dados do usuário
                this.setAuthData(data.data.token, data.data.user);
                
                this.showAlert('Login realizado com sucesso!', 'success');
                
                // Redirecionar para a página inicial após 1 segundo
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
                
            } else {
                this.showAlert(data.error || data.message || 'Erro no login', 'error');
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
        
        if (data.password.length < 6) {
            this.showAlert('A senha deve ter pelo menos 6 caracteres', 'error');
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
            
            // Verificar se a resposta é JSON válido
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Resposta do servidor não é JSON válido');
            }
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                // Salvar token e dados do usuário
                this.setAuthData(result.data.token, result.data.user);
                
                this.showAlert('Conta criada com sucesso!', 'success');
                
                // Redirecionar para a página inicial após 1 segundo
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
                
            } else {
                this.showAlert(result.error || result.message || 'Erro no cadastro', 'error');
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
        this.redirectToHomePage(); // NOVO: Redirecionar se necessário
        return true;
    } else {
        this.updateUIForAuthState(false);
        this.redirectToHomePage(); // NOVO: Redirecionar se necessário
        return false;
    }
}

// NOVO MÉTODO: Redirecionar para a página inicial correta
redirectToHomePage() {
    if (this.isAuthenticated()) {
        // Se estiver logado, redireciona para inicial.html
        if (window.location.pathname === '/' || 
            window.location.pathname.includes('index.html') ||
            window.location.pathname === '/index.html') {
            window.location.href = 'inicial.html';
        }
    } else {
        // Se não estiver logado, redireciona para index
        if (window.location.pathname.includes('inicial.html')) {
            window.location.href = 'index.html';
        }
    }
}
    
    // NOVO MÉTODO: Verificar se usuário é admin
    isUserAdmin() {
        const { user } = this.getAuthData();
        return user && user.role === 'admin';
    }
    
    // NOVO MÉTODO: Obter URL do perfil baseado na role
    getProfileUrl() {
        return this.isUserAdmin() ? 'perfiladm.html' : 'perfil.html';
    }
    
updateUIForAuthState(isAuthenticated, user = null) {
    // Atualizar navbar de ações (botões de login/cadastro)
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
        if (isAuthenticated && user) {
            const profileUrl = this.getProfileUrl();
            const firstName = user.name ? user.name.split(' ')[0] : 'Usuário';
            
            navActions.innerHTML = `
                <div class="user-menu">
                    <span class="user-greeting">Olá, ${firstName}</span>
                    <div class="dropdown">
                        <button class="btn btn-outline" id="userDropdown">
                            <i class="fas fa-user"></i>
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-content">
                            <a href="${profileUrl}" class="profile-link">
                                <i class="fas fa-user"></i>
                                ${this.isUserAdmin() ? 'Painel Admin' : 'Meu Perfil'}
                            </a>
                            <a href="#" id="logoutBtn" class="logout-link">
                                <i class="fas fa-sign-out-alt"></i>
                                Sair
                            </a>
                        </div>
                    </div>
                </div>
            `;
            
            // Re-adicionar event listeners
            setTimeout(() => {
                const logoutBtn = document.getElementById('logoutBtn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.handleLogout();
                    });
                }
                
                // Adicionar toggle para dropdown
                const userDropdown = document.getElementById('userDropdown');
                const dropdownContent = userDropdown?.nextElementSibling;
                
                if (userDropdown && dropdownContent) {
                    userDropdown.addEventListener('click', (e) => {
                        e.stopPropagation();
                        dropdownContent.style.display = 
                            dropdownContent.style.display === 'block' ? 'none' : 'block';
                    });
                    
                    // Fechar dropdown ao clicar fora
                    document.addEventListener('click', () => {
                        dropdownContent.style.display = 'none';
                    });
                }
            }, 100);
        } else {
            navActions.innerHTML = `
                <a href="login.html" class="btn btn-outline">Entrar</a>
                <a href="cadastro.html" class="btn btn-primary">Abrir Conta</a>
            `;
        }
    }
    
    // NOVO: Atualizar menu de navegação
    this.updateNavigationForAuthState(isAuthenticated);
    
    // Redirecionar se tentar acessar login/registro já logado
    if (isAuthenticated && 
        (window.location.pathname.includes('/login') || 
         window.location.pathname.includes('/cadastro') ||
         window.location.pathname === '/login.html' ||
         window.location.pathname === '/cadastro.html')) {
        setTimeout(() => {
            window.location.href = '/';
        }, 100);
    }
    
    // Proteger rotas administrativas
    if (!this.isUserAdmin() && 
        (window.location.pathname.includes('admin') || 
         window.location.pathname.includes('perfiladm'))) {
        this.showAlert('Acesso não autorizado', 'error');
        setTimeout(() => {
            window.location.href = this.getProfileUrl();
        }, 2000);
    }
}
    
    setButtonLoading(button, isLoading) {
        if (!button) return;
        
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        } else {
            button.disabled = false;
            if (button.closest('#loginForm')) {
                button.innerHTML = '<i class="fas fa-sign-in-alt"></i> Entrar na Conta';
            } else if (button.closest('#registerForm')) {
                button.innerHTML = '<i class="fas fa-user-plus"></i> Criar Minha Conta';
            } else {
                button.innerHTML = button.dataset.originalText || 'Concluir';
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
        const mainContent = document.querySelector('.auth-card') || 
                           document.querySelector('.hero') || 
                           document.querySelector('main') || 
                           document.body;
        
        if (mainContent) {
            mainContent.parentNode.insertBefore(alert, mainContent);
        } else {
            document.body.appendChild(alert);
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
    
    // NOVO MÉTODO: Forçar verificação de autenticação em páginas protegidas
    requireAuth(redirectUrl = 'login.html') {
        if (!this.isAuthenticated()) {
            this.showAlert('Você precisa estar logado para acessar esta página', 'error');
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 2000);
            return false;
        }
        return true;
    }
    
    // NOVO MÉTODO: Forçar verificação de admin
    requireAdmin(redirectUrl = 'perfil.html') {
        if (!this.isAuthenticated()) {
            this.showAlert('Você precisa estar logado para acessar esta página', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return false;
        }
        
        if (!this.isUserAdmin()) {
            this.showAlert('Acesso restrito a administradores', 'error');
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 2000);
            return false;
        }
        
        return true;
    }

// NOVO MÉTODO: Gerenciar navegação baseada na autenticação
updateNavigationForAuthState(isAuthenticated) {
    const navMenu = document.querySelector('.nav-menu');
    const navBrand = document.querySelector('.nav-brand a');
    
    if (!navMenu) return;

    if (isAuthenticated) {
        // Usuário logado - mostrar todas as páginas
        navMenu.innerHTML = `
            <a href="inicial.html" class="nav-link">Inicial</a>
            <a href="hist.html" class="nav-link">Histórico</a>
            <a href="dashboard.html" class="nav-link">Dashboard</a>
            <a href="perfil.html" class="nav-link">Perfil</a>
            <a href="suporte.html" class="nav-link">Blinkie</a>
            ${this.isUserAdmin() ? '<a href="perfiladm.html" class="nav-link">Admin</a>' : ''}
        `;
        
        // Atualizar link da logo para inicial.html
        if (navBrand) {
            navBrand.href = 'inicial.html';
        }
    } else {
        // Usuário não logado - mostrar apenas sobre e contato
        navMenu.innerHTML = `
            <a href="sobre.html" class="nav-link">Sobre</a>
            <a href="contato.html" class="nav-link">Contato</a>
        `;
        
        // Atualizar link da logo para index.html
        if (navBrand) {
            navBrand.href = 'index.html';
        }
    }
}
}



// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
    
    // Adicionar CSS para os alertas se não existir
    if (!document.querySelector('#auth-alert-styles')) {
        const style = document.createElement('style');
        style.id = 'auth-alert-styles';
        style.textContent = `
            .auth-alert {
                position: fixed;
                top: 100px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 10000;
                min-width: 300px;
                max-width: 500px;
                animation: slideDown 0.3s ease;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            
            .auth-alert-success {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            
            .auth-alert-error {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
            
            .auth-alert-warning {
                background: #fff3cd;
                color: #856404;
                border: 1px solid #ffeaa7;
            }
            
            .auth-alert-info {
                background: #d1ecf1;
                color: #0c5460;
                border: 1px solid #bee5eb;
            }
            
            .alert-content {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px 20px;
            }
            
            .alert-close {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                margin-left: auto;
                opacity: 0.7;
                transition: opacity 0.2s ease;
            }
            
            .alert-close:hover {
                opacity: 1;
            }
            
            .user-greeting {
                margin-right: 8px;
                font-weight: 500;
            }
            
            .dropdown {
                position: relative;
                display: inline-block;
            }
            
            .dropdown-content {
                display: none;
                position: absolute;
                right: 0;
                background: white;
                min-width: 160px;
                box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                border-radius: 8px;
                border: 1px solid #E5E7EB;
                z-index: 1000;
                margin-top: 8px;
            }
            
            .dropdown-content a {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 16px;
                text-decoration: none;
                color: #1F2937;
                transition: background 0.2s ease;
            }
            
            .dropdown-content a:hover {
                background: #F8FAFC;
            }
            
            .profile-link, .logout-link {
                border: none;
                width: 100%;
                text-align: left;
                background: none;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    }
});

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}