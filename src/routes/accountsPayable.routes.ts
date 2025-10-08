import { Router } from 'express';
import {
  getAllAccountsPayable,
  getAccountPayableById,
  createAccountPayable,
  updateAccountPayable,
  deleteAccountPayable
} from '../controllers/accountsPayable.controller';

const router = Router();

router.get('/', getAllAccountsPayable);
router.get('/:id', getAccountPayableById);
router.post('/', createAccountPayable);
router.put('/:id', updateAccountPayable);
router.delete('/:id', deleteAccountPayable);

export default router;
