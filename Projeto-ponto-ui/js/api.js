// API.js - Sistema de integração com backend
const API = {
    baseURL: 'https://ponto-api-2.onrender.com', // Altere para sua URL do backend
    
    // Headers padrão
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    },

    // Método genérico para requisições
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `Erro HTTP: ${response.status}`);
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, message: error.message };
        }
    },

    // Autenticação - Login
    async login(email, senha) {
        return await this.request('/login', {
            method: 'POST',
            body: JSON.stringify({ email, senha })
        });
    },

    // Usuários - Criar usuário (Cadastro)
    async criarUsuario(email, senha, role) {
        return await this.request('/usuarios', {
            method: 'POST',
            body: JSON.stringify({ email, senha, role })
        });
    },

    // Usuários - Listar todos
    async listarUsuarios() {
        return await this.request('/usuarios', {
            method: 'GET'
        });
    },

    // Usuários - Buscar por ID
    async listarUsuarioUnico(id) {
        return await this.request(`/usuarios/${id}`, {
            method: 'GET'
        });
    },

    // Ponto - Registrar ponto
    async registrarPonto(pontoData) {
        return await this.request('/ponto', {
            method: 'POST',
            body: JSON.stringify(pontoData)
        });
    },

    // Pontos - Listar pontos (você pode adicionar esta rota no backend)
   // Pontos - Listar pontos com verificação de role
async listarPontos(usuarioId = null, dataInicio = null, dataFim = null) {
    let endpoint = '/ponto';
    const params = new URLSearchParams();

    try {
        const user = Auth.getCurrentUser();
        if (!user) throw new Error("Usuário não autenticado");

        // Se não for admin, força filtro pelo próprio ID
        if (user.role !== 'ADMIN') {
            usuarioId = user.id;
        }

        if (usuarioId) params.append('usuarioId', usuarioId);
        if (dataInicio) params.append('dataInicio', dataInicio);
        if (dataFim) params.append('dataFim', dataFim);

        if (params.toString()) {
            endpoint += `?${params.toString()}`;
        }

        const response = await this.request(endpoint, {
            method: 'GET'
        });

        // Retorna direto o array, ou lança erro
        if (response.success) return response.data;
        else throw new Error(response.message);
    } catch (error) {
        console.error('Erro em listarPontos:', error);
        return [];
    }
}

};

// Auth.js - Sistema de autenticação integrado
const Auth = {
    // Fazer login
    async login(email, senha, role) {
        try {
            const response = await API.login(email, senha);
            
            if (response.success) {
                // Armazenar dados do usuário
                const userData = {
                    id: response.data.id,
                    email: response.data.email,
                    role: response.data.role || role // Usar role do backend ou fallback
                };
                
                localStorage.setItem('user', JSON.stringify(userData));
                return { success: true, user: userData };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            return { success: false, message: 'Erro de conexão' };
        }
    },

    // Registrar usuário
    async register(email, senha, role) {
        try {
            const response = await API.criarUsuario(email, senha, role);
            
            if (response.success) {
                return { success: true, message: 'Usuário criado com sucesso' };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            return { success: false, message: 'Erro de conexão' };
        }
    },

    // Obter usuário atual
    getCurrentUser() {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    },

    // Fazer logout
    logout() {
        localStorage.removeItem('user');
    },

    // Verificar se está autenticado
    isAuthenticated() {
        return this.getCurrentUser() !== null;
    }
};