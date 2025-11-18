"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsReceivableController = void 0;
const zod_1 = require("zod");
const accountsReceivable_model_1 = __importDefault(require("../models/accountsReceivable.model"));
class AccountsReceivableController {
    // GET todas as contas do usuário logado
    async getAccountsReceivable(req, res) {
        try {
            // Verifica se o usuário está autenticado
            if (!req.user?.id) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }
            // Busca apenas as contas do usuário logado
            const accounts = await accountsReceivable_model_1.default.findAll({
                where: { userId: req.user.id },
                order: [['dueDate', 'ASC']], // opcional: ordenar por data
            });
            res.json(accounts);
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar contas a receber' });
        }
    }
    // POST criar nova conta
    async createAccountReceivable(req, res) {
        // Schema de validação - aceita apenas os campos esperados
        const createSchema = zod_1.z.object({
            client: zod_1.z.string().min(1),
            amount: zod_1.z.number().nonnegative(),
            received_date: zod_1.z.string().optional(),
        });
        try {
            // Valida e retorna apenas os campos permitidos
            const data = createSchema.parse(req.body);
            // Garante que o usuário está autenticado
            if (!req.user?.id) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }
            // Cria a conta no banco vinculando ao usuário logado
            const account = await accountsReceivable_model_1.default.create({
                client: data.client,
                amount: data.amount,
                receivedDate: data.received_date ? new Date(data.received_date) : undefined,
                userId: req.user.id,
                status: 'pending', // força o status inicial
            });
            res.status(201).json(account);
        }
        catch (err) {
            if (err?.issues) {
                // Erro do zod
                return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
            }
            return res.status(400).json({ error: 'Erro ao criar conta a receber' });
        }
    }
    // PUT atualizar conta
    async updateAccountReceivable(req, res) {
        // Schema de validação - aceita apenas os campos que podem ser atualizados
        const updateSchema = zod_1.z.object({
            client: zod_1.z.string().min(1).optional(),
            amount: zod_1.z.number().nonnegative().optional(),
            received_date: zod_1.z.string().optional(),
            status: zod_1.z.enum(['pending', 'received']).optional(),
        });
        try {
            const data = updateSchema.parse(req.body);
            const { id } = req.params;
            // Verifica se o usuário está autenticado
            if (!req.user?.id) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }
            // Busca a conta pelo id e usuário logado
            const account = await accountsReceivable_model_1.default.findOne({
                where: { id, userId: req.user.id },
            });
            if (!account) {
                return res.status(404).json({ error: 'Conta não encontrada' });
            }
            // Atualiza os campos permitidos
            await account.update({
                client: data.client ?? account.client,
                amount: data.amount ?? account.amount,
                receivedDate: data.received_date ? new Date(data.received_date) : account.receivedDate,
                status: data.status ?? account.status,
            });
            return res.json(account);
        }
        catch (err) {
            if (err?.issues) {
                // Erro de validação
                return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
            }
            return res.status(400).json({ error: 'Erro ao atualizar conta' });
        }
    }
    // DELETE deletar conta
    async deleteAccountReceivable(req, res) {
        try {
            const { id } = req.params;
            // Verifica se o usuário está autenticado
            if (!req.user?.id) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }
            // Busca a conta pelo id e usuário logado
            const account = await accountsReceivable_model_1.default.findOne({
                where: { id, userId: req.user.id },
            });
            if (!account) {
                return res.status(404).json({ error: 'Conta não encontrada' });
            }
            // Deleta a conta
            await account.destroy();
            return res.json({ message: 'Conta deletada com sucesso' });
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar conta' });
        }
    }
}
exports.AccountsReceivableController = AccountsReceivableController;
exports.default = new AccountsReceivableController();
