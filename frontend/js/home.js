// Adicione ao seu home.js ou crie um novo arquivo

// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.body.removeAttribute('data-theme');
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeIcon.className = 'fas fa-sun';
}

themeToggle.addEventListener('click', toggleTheme);

// Active link highlighting
const currentPage = window.location.pathname.split('/').pop();
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});

// Sistema de Autenticação
        const AuthManager = {
            storageKeys: {
                TOKEN: 'blync_token',
                USER_DATA: 'blync_user_data'
            },

            // Verificar se usuário está autenticado
            isAuthenticated() {
                const token = localStorage.getItem(this.storageKeys.TOKEN);
                const userData = localStorage.getItem(this.storageKeys.USER_DATA);
                return !!(token && userData);
            },

            // Fazer login
            login(email, password) {
                // Simulação de autenticação
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        if (email && password) {
                            const userData = {
                                id: 1,
                                name: 'João Silva',
                                email: email,
                                avatar: null
                            };
                            
                            localStorage.setItem(this.storageKeys.TOKEN, 'fake-jwt-token');
                            localStorage.setItem(this.storageKeys.USER_DATA, JSON.stringify(userData));
                            resolve(userData);
                        } else {
                            reject('Credenciais inválidas');
                        }
                    }, 1000);
                });
            },

            // Fazer logout
            logout() {
                localStorage.removeItem(this.storageKeys.TOKEN);
                localStorage.removeItem(this.storageKeys.USER_DATA);
                window.location.reload();
            },

            // Obter dados do usuário
            getUserData() {
                const userData = localStorage.getItem(this.storageKeys.USER_DATA);
                return userData ? JSON.parse(userData) : null;
            }
        };

        // Gerenciador de Rotas
        const RouteManager = {
            // Verificar autenticação e mostrar conteúdo apropriado
            checkAuthAndShowContent() {
                const isAuthenticated = AuthManager.isAuthenticated();
                const currentPath = window.location.pathname;

                // Mostrar navbar apropriada
                if (isAuthenticated) {
                    document.getElementById('navbarAuthenticated').style.display = 'block';
                    document.getElementById('navbarPublic').style.display = 'none';
                    document.getElementById('authenticatedContent').classList.remove('hidden');
                    document.getElementById('publicContent').classList.add('hidden');
                    document.getElementById('loginArea').classList.add('hidden');
                    
                    // Atualizar nome do usuário
                    const userData = AuthManager.getUserData();
                    if (userData) {
                        document.getElementById('userName').textContent = userData.name;
                    }
                } else {
                    document.getElementById('navbarAuthenticated').style.display = 'none';
                    document.getElementById('navbarPublic').style.display = 'block';
                    document.getElementById('authenticatedContent').classList.add('hidden');
                    
                    // Se estiver na página de login, mostrar formulário
                    if (currentPath.includes('login.html') || currentPath === '/login') {
                        document.getElementById('publicContent').classList.add('hidden');
                        document.getElementById('loginArea').classList.remove('hidden');
                    } else {
                        document.getElementById('publicContent').classList.remove('hidden');
                        document.getElementById('loginArea').classList.add('hidden');
                    }
                }
            },

            // Proteger rotas que requerem autenticação
            protectRoute() {
                const isAuthenticated = AuthManager.isAuthenticated();
                const protectedRoutes = ['/dashboard', '/historico', '/transacoes', '/perfil'];
                const currentPath = window.location.pathname;

                const isProtectedRoute = protectedRoutes.some(route => 
                    currentPath.includes(route) || currentPath === route + '.html'
                );

                if (isProtectedRoute && !isAuthenticated) {
                    window.location.href = '/login.html';
                    return false;
                }

                return true;
            }
        };

        // Inicialização
        document.addEventListener('DOMContentLoaded', function() {
            // Configurar menu mobile
            setupMobileMenu();
            
            // Verificar autenticação e mostrar conteúdo
            RouteManager.protectRoute();
            RouteManager.checkAuthAndShowContent();

            // Configurar formulário de login
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', handleLogin);
            }
        });

        // Configurar menu mobile
        function setupMobileMenu() {
            // Menu mobile para navbar autenticada
            const authMobileBtn = document.getElementById('authMobileMenuBtn');
            const authNavMenu = document.getElementById('authNavMenu');
            
            if (authMobileBtn && authNavMenu) {
                authMobileBtn.addEventListener('click', () => {
                    authNavMenu.classList.toggle('active');
                    const icon = authMobileBtn.querySelector('i');
                    icon.className = authNavMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
                });
            }

            // Menu mobile para navbar pública
            const publicMobileBtn = document.getElementById('publicMobileMenuBtn');
            const publicNavMenu = document.getElementById('publicNavMenu');
            
            if (publicMobileBtn && publicNavMenu) {
                publicMobileBtn.addEventListener('click', () => {
                    publicNavMenu.classList.toggle('active');
                    const icon = publicMobileBtn.querySelector('i');
                    icon.className = publicNavMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
                });
            }

            // Fechar menus ao clicar fora
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-btn')) {
                    document.querySelectorAll('.nav-menu').forEach(menu => {
                        menu.classList.remove('active');
                    });
                    document.querySelectorAll('.mobile-menu-btn i').forEach(icon => {
                        icon.className = 'fas fa-bars';
                    });
                }
            });
        }

        // Manipular login
        async function handleLogin(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const submitBtn = e.target.querySelector('button[type="submit"]');
            
            // Mostrar loading
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
            submitBtn.disabled = true;
            
            try {
                await AuthManager.login(email, password);
                RouteManager.checkAuthAndShowContent();
                
                // Redirecionar para dashboard após login bem-sucedido
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 500);
                
            } catch (error) {
                alert('Erro ao fazer login: ' + error);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }

        // Função de logout
        function logout() {
            if (confirm('Tem certeza que deseja sair?')) {
                AuthManager.logout();
            }
        }

        // Verificar autenticação em mudanças de página (SPA)
        window.addEventListener('popstate', function() {
            RouteManager.checkAuthAndShowContent();
        });

        // Expor funções globalmente
        window.logout = logout;
        window.AuthManager = AuthManager;
        window.RouteManager = RouteManager;