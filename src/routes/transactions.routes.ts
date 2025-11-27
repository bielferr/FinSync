import { Router } from 'express';
import TransactionsController from '../controllers/transactions.controller';

const router = Router();

router.get('/novatransacao.html', TransactionsController.list.bind(TransactionsController));
router.get('/novatransacao.html:id', TransactionsController.get.bind(TransactionsController));
router.post('/novatransacao.html', TransactionsController.create.bind(TransactionsController));
router.put('/novatransacao.html:id', TransactionsController.update.bind(TransactionsController));
router.delete('novatransacao.html/:id', TransactionsController.delete.bind(TransactionsController));

export default router;
