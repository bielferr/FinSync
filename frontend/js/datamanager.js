// js/data-manager.js
class BlyncDataManager {
    constructor() {
        this.storageKeys = {
            TRANSACTIONS: 'finsync_transactions',
            USER_DATA: 'blync_user_data',
            BUDGETS: 'blync_budgets',
            LAST_SYNC: 'blync_last_sync'
        };
        
        this.categories = {
            'salario': { name: 'Salário', icon: 'fas fa-money-bill-wave' },
            'alimentacao': { name: 'Alimentação', icon: 'fas fa-utensils' },
            'transporte': { name: 'Transporte', icon: 'fas fa-bus' },
            'moradia': { name: 'Moradia', icon: 'fas fa-home' },
            'saude': { name: 'Saúde', icon: 'fas fa-heartbeat' },
            'educacao': { name: 'Educação', icon: 'fas fa-graduation-cap' },
            'lazer': { name: 'Lazer', icon: 'fas fa-film' },
            'compras': { name: 'Compras', icon: 'fas fa-shopping-bag' },
            'investimentos': { name: 'Investimentos', icon: 'fas fa-chart-line' },
            'outros': { name: 'Outros', icon: 'fas fa-circle' }
        };

        this.defaultData = [
            {
                id: this.generateId(),
                type: 'income',
                description: 'Salário Mensal',
                amount: 3500.00,
                date: new Date().toISOString().split('T')[0],
                category: 'salario',
                paymentMethod: 'transferencia',
                notes: 'Salário referente ao mês atual',
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                type: 'expense',
                description: 'Supermercado',
                amount: 256.33,
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                category: 'alimentacao',
                paymentMethod: 'debito',
                notes: 'Compra do mês',
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                type: 'expense',
                description: 'Aluguel',
                amount: 1200.00,
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                category: 'moradia',
                paymentMethod: 'transferencia',
                notes: 'Aluguel do apartamento',
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                type: 'income',
                description: 'Freelance',
                amount: 800.00,
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                category: 'outros',
                paymentMethod: 'pix',
                notes: 'Trabalho freelance',
                createdAt: new Date().toISOString()
            }
        ];
    }

    // Inicializar dados
    initialize() {
        this.initializeUserData();
        this.initializeTransactions();
        this.initializeBudgets();
        this.updateLastSync();
    }

    // Dados do usuário
    initializeUserData() {
        if (!localStorage.getItem(this.storageKeys.USER_DATA)) {
            const userData = {
                name: 'Admin',
                email: 'admin@finsync.com',
                role: 'admin',
                createdAt: new Date().toISOString()
            };
            localStorage.setItem(this.storageKeys.USER_DATA, JSON.stringify(userData));
        }
    }

    getUserData() {
        const userData = localStorage.getItem(this.storageKeys.USER_DATA);
        return userData ? JSON.parse(userData) : null;
    }

    updateUserData(userData) {
        localStorage.setItem(this.storageKeys.USER_DATA, JSON.stringify(userData));
    }

    // Transações
    initializeTransactions() {
        if (!localStorage.getItem(this.storageKeys.TRANSACTIONS)) {
            localStorage.setItem(this.storageKeys.TRANSACTIONS, JSON.stringify(this.defaultData));
        }
    }

    getTransactions() {
        const transactions = localStorage.getItem(this.storageKeys.TRANSACTIONS);
        return transactions ? JSON.parse(transactions) : [];
    }

    addTransaction(transaction) {
        const transactions = this.getTransactions();
        transaction.id = this.generateId();
        transaction.createdAt = new Date().toISOString();
        transactions.unshift(transaction);
        localStorage.setItem(this.storageKeys.TRANSACTIONS, JSON.stringify(transactions));
        return transaction;
    }

    updateTransaction(id, updatedTransaction) {
        const transactions = this.getTransactions();
        const index = transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            transactions[index] = { ...transactions[index], ...updatedTransaction };
            localStorage.setItem(this.storageKeys.TRANSACTIONS, JSON.stringify(transactions));
            return transactions[index];
        }
        return null;
    }

    deleteTransaction(id) {
        const transactions = this.getTransactions();
        const filteredTransactions = transactions.filter(t => t.id !== id);
        localStorage.setItem(this.storageKeys.TRANSACTIONS, JSON.stringify(filteredTransactions));
        return filteredTransactions.length !== transactions.length;
    }

    // Orçamentos
    initializeBudgets() {
        if (!localStorage.getItem(this.storageKeys.BUDGETS)) {
            const defaultBudgets = [
                { category: 'Alimentação', spent: 256.33, limit: 1000, color: 'food' },
                { category: 'Transporte', spent: 0, limit: 500, color: 'transport' },
                { category: 'Entretenimento', spent: 0, limit: 500, color: 'entertainment' },
                { category: 'Compras', spent: 0, limit: 500, color: 'shopping' }
            ];
            localStorage.setItem(this.storageKeys.BUDGETS, JSON.stringify(defaultBudgets));
        }
    }

    getBudgets() {
        const budgets = localStorage.getItem(this.storageKeys.BUDGETS);
        return budgets ? JSON.parse(budgets) : [];
    }

    // Cálculos e estatísticas
    calculateStats(transactions = null) {
        const allTransactions = transactions || this.getTransactions();
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        let totalIncome = 0;
        let totalExpense = 0;
        let monthIncome = 0;
        let monthExpense = 0;

        allTransactions.forEach(transaction => {
            const transactionDate = new Date(transaction.date);
            
            if (transaction.type === 'income') {
                totalIncome += transaction.amount;
                if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
                    monthIncome += transaction.amount;
                }
            } else {
                totalExpense += transaction.amount;
                if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
                    monthExpense += transaction.amount;
                }
            }
        });

        return {
            totalBalance: totalIncome - totalExpense,
            monthIncome: monthIncome,
            monthExpense: monthExpense,
            transactionsCount: allTransactions.length,
            monthTransactions: allTransactions.filter(t => {
                const date = new Date(t.date);
                return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            }).length
        };
    }

    // Filtros
    filterTransactions(filters = {}) {
        let transactions = this.getTransactions();
        const { period = 'all', type = 'all', category = 'all' } = filters;

        // Filtro por período
        if (period !== 'all') {
            const now = new Date();
            transactions = transactions.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                
                switch (period) {
                    case 'today':
                        return transactionDate.toDateString() === now.toDateString();
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return transactionDate >= weekAgo;
                    case 'month':
                        return transactionDate.getMonth() === now.getMonth() && 
                               transactionDate.getFullYear() === now.getFullYear();
                    case 'year':
                        return transactionDate.getFullYear() === now.getFullYear();
                    default:
                        return true;
                }
            });
        }

        // Filtro por tipo
        if (type !== 'all') {
            transactions = transactions.filter(transaction => transaction.type === type);
        }

        // Filtro por categoria
        if (category !== 'all') {
            transactions = transactions.filter(transaction => transaction.category === category);
        }

        // Ordenar por data (mais recente primeiro)
        return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Utilitários
    getCategoryInfo(category) {
        return this.categories[category] || { name: category, icon: 'fas fa-circle' };
    }

    getCategoryName(category) {
        return this.getCategoryInfo(category).name;
    }

    getCategoryIcon(category) {
        return this.getCategoryInfo(category).icon;
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Sincronização
    updateLastSync() {
        localStorage.setItem(this.storageKeys.LAST_SYNC, new Date().toISOString());
    }

    getLastSync() {
        return localStorage.getItem(this.storageKeys.LAST_SYNC);
    }

    // Exportação
    exportToCSV() {
        const transactions = this.getTransactions();
        if (transactions.length === 0) {
            return null;
        }
        
        const headers = ['Data', 'Descrição', 'Tipo', 'Categoria', 'Valor', 'Forma de Pagamento', 'Observações'];
        const csvData = transactions.map(transaction => [
            this.formatDate(transaction.date),
            transaction.description,
            transaction.type === 'income' ? 'Receita' : 'Despesa',
            this.getCategoryName(transaction.category),
            transaction.amount,
            transaction.paymentMethod || '',
            transaction.notes || ''
        ]);
        
        const csvContent = [headers, ...csvData]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
        
        return csvContent;
    }

    // Limpar dados (apenas para desenvolvimento)
    clearAllData() {
        localStorage.removeItem(this.storageKeys.TRANSACTIONS);
        localStorage.removeItem(this.storageKeys.BUDGETS);
        localStorage.removeItem(this.storageKeys.USER_DATA);
        this.initialize();
    }

    // Adicionar dados de exemplo
    addSampleData() {
        this.clearAllData();
        return this.getTransactions();
    }
}

// Criar instância global
window.BlyncDataManager = new BlyncDataManager();

// Inicializar quando o script for carregado
document.addEventListener('DOMContentLoaded', function() {
    window.BlyncDataManager.initialize();
});