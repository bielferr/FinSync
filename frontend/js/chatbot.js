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
            // 🟢 PRIMEIRO VERIFICA SE É UMA CONSULTA LOCAL
            const localResponse = this.processLocalMessage(message);
            if (localResponse) {
                // Esconder indicador de digitação
                this.hideTypingIndicator();
                
                // Simular delay de resposta mais natural
                setTimeout(() => {
                    // Adicionar resposta do bot com dados locais
                    this.addMessage(localResponse, 'bot');
                    
                    // Atualizar quick replies para consultas financeiras
                    this.updateFinancialQuickReplies();
                    
                    this.scrollToBottom();
                }, 1000);
                return;
            }
            
            // Se não for consulta local, faz requisição para a API
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
    
    // 🟢 NOVA FUNÇÃO: Processa mensagens localmente (consultas financeiras)
    processLocalMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // 🟢 CONSULTA DE SALDO ATUALIZADA
        if (lowerMessage.includes('saldo') || 
            lowerMessage.includes('quanto tenho') || 
            lowerMessage.includes('meu saldo') ||
            lowerMessage.includes('consultar saldo')) {
            
            const balanceData = getRealBalance();
            return balanceData.message;
        }
        
        // 🟢 CONSULTA DE TRANSAÇÕES RECENTES
        if (lowerMessage.includes('transações') || 
            lowerMessage.includes('histórico') || 
            lowerMessage.includes('extrato') ||
            lowerMessage.includes('últimas transações') ||
            lowerMessage.includes('ver extrato')) {
            
            const recentTransactions = getRecentTransactions(5);
            
            if (recentTransactions.length === 0) {
                return "📝 *Nenhuma transação recente encontrada.*\n\nUse a página 'Nova Transação' para adicionar sua primeira transação!";
            }
            
            let response = "📝 *Suas últimas transações:*\n\n";
            recentTransactions.forEach((transaction, index) => {
                const typeIcon = transaction.type === 'income' ? '💹' : '📤';
                const typeText = transaction.type === 'income' ? 'Receita' : 'Despesa';
                const amount = formatCurrency(transaction.amount);
                
                response += `${typeIcon} *${transaction.description}*\n`;
                response += `   💰 Valor: ${amount}\n`;
                response += `   📅 Data: ${formatDate(transaction.date)}\n`;
                response += `   🏷️ Categoria: ${getCategoryName(transaction.category)}\n`;
                response += `   ⚡ Tipo: ${typeText}\n`;
                
                if (transaction.notes) {
                    response += `   📝 Observações: ${transaction.notes}\n`;
                }
                
                if (index < recentTransactions.length - 1) {
                    response += `   ───────────────────\n`;
                }
            });
            
            return response;
        }
        
        // 🟢 CONSULTA DE RECEITAS
        if (lowerMessage.includes('receitas') || 
            lowerMessage.includes('ganhos') || 
            lowerMessage.includes('entradas') ||
            lowerMessage.includes('quanto ganhei')) {
            
            const balanceData = getRealBalance();
            return `📈 *Suas receitas totais:* ${formatCurrency(balanceData.totalIncome)}\n\n💡 *Dica:* Continue registrando suas receitas para manter o controle financeiro!`;
        }
        
        // 🟢 CONSULTA DE DESPESAS
        if (lowerMessage.includes('despesas') || 
            lowerMessage.includes('gastos') || 
            lowerMessage.includes('saídas') ||
            lowerMessage.includes('quanto gastei')) {
            
            const balanceData = getRealBalance();
            return `📉 *Suas despesas totais:* ${formatCurrency(balanceData.totalExpense)}\n\n💡 *Dica:* Analise seus gastos para identificar oportunidades de economia!`;
        }
        
        // 🟢 RESUMO COMPLETO
        if (lowerMessage.includes('resumo') || 
            lowerMessage.includes('resumo financeiro') || 
            lowerMessage.includes('visão geral')) {
            
            const balanceData = getRealBalance();
            const recentTransactions = getRecentTransactions(3);
            
            let response = `📊 *Seu Resumo Financeiro*\n\n`;
            response += `💰 *Saldo Atual:* ${formatCurrency(balanceData.balance)}\n`;
            response += `📈 *Total de Receitas:* ${formatCurrency(balanceData.totalIncome)}\n`;
            response += `📉 *Total de Despesas:* ${formatCurrency(balanceData.totalExpense)}\n`;
            response += `📝 *Total de Transações:* ${recentTransactions.length}\n\n`;
            
            if (recentTransactions.length > 0) {
                response += `🔄 *Últimas Transações:*\n`;
                recentTransactions.forEach(transaction => {
                    const typeIcon = transaction.type === 'income' ? '⬇️' : '⬆️';
                    response += `${typeIcon} ${transaction.description}: ${formatCurrency(transaction.amount)}\n`;
                });
            }
            
            return response;
        }
        
        // 🟢 AJUDA FINANCEIRA
        if (lowerMessage.includes('ajuda financeira') || 
            lowerMessage.includes('comandos') || 
            lowerMessage.includes('o que você faz') ||
            lowerMessage.includes('como usar')) {
            
            return "💡 *Posso ajudar com consultas financeiras:*\n\n" +
                   "• 'Saldo' - Ver seu saldo atual\n" +
                   "• 'Extrato' - Ver transações recentes\n" + 
                   "• 'Receitas' - Ver total de ganhos\n" +
                   "• 'Despesas' - Ver total de gastos\n" +
                   "• 'Resumo' - Visão geral financeira\n\n" +
                   "*Dados em tempo real do seu histórico!* 💰";
        }
        
        return null; // Retorna null para mensagens não financeiras
    }
    
    // 🟢 NOVA FUNÇÃO: Atualiza quick replies para consultas financeiras
    updateFinancialQuickReplies() {
        const financialReplies = [
            "Consultar saldo",
            "Ver extrato", 
            "Minhas receitas",
            "Minhas despesas",
            "Resumo financeiro"
        ];
        
        this.updateQuickReplies(financialReplies);
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
        // Substituir quebras de linha por <br> e *texto* por <strong>texto</strong>
        return text
            .replace(/\n/g, '<br>')
            .replace(/\*(.*?)\*/g, '<strong>$1</strong>');
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

// 🟢 FUNÇÕES PARA ACESSAR DADOS REAIS DO HISTÓRICO

function getRealBalance() {
    try {
        // Buscar transações do localStorage (mesmo local do histórico)
        const transactions = JSON.parse(localStorage.getItem('finsync_transactions') || '[]');
        
        if (transactions.length === 0) {
            return {
                balance: 0,
                totalIncome: 0,
                totalExpense: 0,
                message: "💰 *Nenhuma transação encontrada* \n\nSeu saldo atual é R$ 0,00\n\n💡 Adicione sua primeira transação para começar!",
                hasTransactions: false
            };
        }
        
        // Calcular totais reais
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const balance = totalIncome - totalExpense;
        
        return {
            balance: balance,
            totalIncome: totalIncome,
            totalExpense: totalExpense,
            message: `💰 *Seu saldo atual é ${formatCurrency(balance)}*\n\n📊 *Resumo detalhado:*\n• 📈 Receitas totais: ${formatCurrency(totalIncome)}\n• 📉 Despesas totais: ${formatCurrency(totalExpense)}\n• 💰 Saldo disponível: ${formatCurrency(balance)}`,
            hasTransactions: true
        };
        
    } catch (error) {
        console.error('Erro ao calcular saldo:', error);
        return {
            balance: 0,
            totalIncome: 0,
            totalExpense: 0,
            message: "❌ *Erro ao calcular saldo* \n\nVerifique se há transações no histórico.",
            hasTransactions: false
        };
    }
}

// Função para formatar moeda
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Função para obter transações recentes
function getRecentTransactions(limit = 5) {
    try {
        const transactions = JSON.parse(localStorage.getItem('finsync_transactions') || '[]');
        
        // Ordenar por data (mais recentes primeiro)
        const sortedTransactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return sortedTransactions.slice(0, limit);
        
    } catch (error) {
        console.error('Erro ao buscar transações:', error);
        return [];
    }
}

// Função para obter categoria em português
function getCategoryName(category) {
    const categories = {
        'salario': 'Salário',
        'alimentacao': 'Alimentação',
        'transporte': 'Transporte',
        'moradia': 'Moradia',
        'saude': 'Saúde',
        'educacao': 'Educação',
        'lazer': 'Lazer',
        'compras': 'Compras',
        'investimentos': 'Investimentos',
        'outros': 'Outros'
    };
    return categories[category] || category;
}

// Função para formatar data
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new ChatbotUI();
});