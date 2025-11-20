import { Router } from 'express';
import TransactionsController from '../controllers/transactions.controller';

const router = Router();

router.get('/', TransactionsController.list.bind(TransactionsController));
router.get('/:id', TransactionsController.get.bind(TransactionsController));
router.post('/', TransactionsController.create.bind(TransactionsController));
router.put('/:id', TransactionsController.update.bind(TransactionsController));
router.delete('/:id', TransactionsController.delete.bind(TransactionsController));

export default router;
