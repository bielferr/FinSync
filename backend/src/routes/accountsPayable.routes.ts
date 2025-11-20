import { Router } from "express";
import AccountPayableController from "../controllers/accountsPayable.controller";

const router = Router();

router.get("/", AccountPayableController.getAll.bind(AccountPayableController));
router.post("/", AccountPayableController.create.bind(AccountPayableController));
router.put("/:id", AccountPayableController.update.bind(AccountPayableController));
router.delete("/:id", AccountPayableController.delete.bind(AccountPayableController));

export default router;
