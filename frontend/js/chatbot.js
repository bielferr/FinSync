class ChatbotUI {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.quickReplies = document.getElementById('quickReplies');
        this.typingIndicator = document.getElementById('typingIndicator');
        
        this.userId = 'user_' + Math.random().toString(36).substr(2, 9);
        this.baseURL = 'http://localhost:3333/api/chatbot';
        
        this.init();
    }
    
    init() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        this.quickReplies.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply')) {
                const message = e.target.getAttribute('data-message');
                this.messageInput.value = message;
                this.sendMessage();
            }
        });
        
        this.messageInput.addEventListener('input', () => {
            this.sendButton.disabled = !this.messageInput.value.trim();
        });
        
        // Focar no input quando a página carregar
        this.messageInput.focus();
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        // Adicionar mensagem do usuário
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.sendButton.disabled = true;
        this.hideQuickReplies();
        
        // Mostrar indicador de digitação
        this.showTypingIndicator();
        
        try {
            const response = await fetch(`${this.baseURL}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    userId: this.userId
                })
            });
            
            const data = await response.json();
            
            // Esconder indicador de digitação
            this.hideTypingIndicator();
            
            if (data.success) {
                // Simular delay de resposta mais natural
                setTimeout(() => {
                    // Adicionar resposta do bot
                    this.addMessage(data.data.message, 'bot');
                    
                    // Atualizar quick replies se existirem
                    if (data.data.quickReplies && data.data.quickReplies.length > 0) {
                        this.updateQuickReplies(data.data.quickReplies);
                    }
                    
                    this.scrollToBottom();
                }, 1000);
            } else {
                this.addMessage('Desculpe, ocorreu um erro. Tente novamente.', 'bot');
            }
        } catch (error) {
            console.error('Erro:', error);
            this.hideTypingIndicator();
            this.addMessage('Erro de conexão. Verifique se o servidor está rodando.', 'bot');
        }
    }
    
    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const time = new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const avatarIcon = type === 'bot' ? 'fas fa-robot' : 'fas fa-user';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="${avatarIcon}"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${this.formatMessage(text)}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    formatMessage(text) {
        // Substituir quebras de linha por <br>
        return text.replace(/\n/g, '<br>');
    }
    
    updateQuickReplies(replies) {
        this.quickReplies.innerHTML = '';
        
        replies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'quick-reply';
            button.innerHTML = `
                <i class="fas fa-comment"></i>
                ${reply}
            `;
            button.setAttribute('data-message', reply);
            this.quickReplies.appendChild(button);
        });
        
        this.quickReplies.style.display = 'flex';
    }
    
    hideQuickReplies() {
        this.quickReplies.style.display = 'none';
    }
    
    showTypingIndicator() {
        this.typingIndicator.style.display = 'block';
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new ChatbotUI();
});