class ChatbotUI {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.quickReplies = document.getElementById('quickReplies');
        
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
        
        // Carregar histórico
        this.loadChatHistory();
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        // Adicionar mensagem do usuário
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.toggleInput(false);
        
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
            
            if (data.success) {
                // Adicionar resposta do bot
                this.addMessage(data.data.message, 'bot');
                
                // Atualizar quick replies
                this.updateQuickReplies(data.data.quickReplies);
            } else {
                this.addMessage('Desculpe, ocorreu um erro. Tente novamente.', 'bot');
            }
        } catch (error) {
            console.error('Erro:', error);
            this.addMessage('Erro de conexão. Verifique se o servidor está rodando.', 'bot');
        }
        
        this.toggleInput(true);
    }
    
    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const time = new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${type === 'bot' ? '🤖' : '👤'}</div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    updateQuickReplies(replies) {
        this.quickReplies.innerHTML = '';
        
        replies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'quick-reply';
            button.textContent = reply;
            button.setAttribute('data-message', reply);
            this.quickReplies.appendChild(button);
        });
    }
    
    toggleInput(enabled) {
        this.messageInput.disabled = !enabled;
        this.sendButton.disabled = !enabled;
        
        if (enabled) {
            this.messageInput.focus();
        }
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    async loadChatHistory() {
        try {
            const response = await fetch(`${this.baseURL}/history/${this.userId}`);
            const data = await response.json();
            
            if (data.success) {
                // Limpar mensagens iniciais
                this.chatMessages.innerHTML = '';
                
                // Adicionar histórico
                data.data.chatHistory.forEach(msg => {
                    this.addMessage(msg.message, msg.type);
                });
            }
        } catch (error) {
            console.log('Não foi possível carregar o histórico');
        }
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new ChatbotUI();
});