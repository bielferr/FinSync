"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accountsReceivable_controller_1 = __importDefault(require("../controllers/accountsReceivable.controller"));
const router = (0, express_1.Router)();
router.get("/", accountsReceivable_controller_1.default.getAccountsReceivable.bind(accountsReceivable_controller_1.default));
router.post("/", accountsReceivable_controller_1.default.createAccountReceivable.bind(accountsReceivable_controller_1.default));
router.put("/:id", accountsReceivable_controller_1.default.updateAccountReceivable.bind(accountsReceivable_controller_1.default));
router.delete("/:id", accountsReceivable_controller_1.default.deleteAccountReceivable.bind(accountsReceivable_controller_1.default));
exports.default = router;
