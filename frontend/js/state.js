// state.js – centraliza os dados dinâmicos

let globalState = {
    user: null,
    dashboard: null,
    historico: null
};

// Função para carregar dados do servidor
export async function loadGlobalData() {
    try {
        const response = await fetch('/api/dados');
        const data = await response.json();

        globalState = {
            ...globalState,
            ...data
        };

        return globalState;

    } catch (error) {
        console.error("Erro ao carregar dados globais:", error);
    }
}

// Função para obter o estado em outras páginas
export function getState() {
    return globalState;
}
