import { Router } from "express";
import AccountsReceivableController from "../controllers/accountsReceivable.controller";
import AuthController from '../controllers/authController';


const router = Router();

router.get("/", AccountsReceivableController.getAccountsReceivable.bind(AccountsReceivableController));
router.post("/", AccountsReceivableController.createAccountReceivable.bind(AccountsReceivableController));
router.put("/:id", AccountsReceivableController.updateAccountReceivable.bind(AccountsReceivableController));
router.delete("/:id", AccountsReceivableController.deleteAccountReceivable.bind(AccountsReceivableController));

export default router;
