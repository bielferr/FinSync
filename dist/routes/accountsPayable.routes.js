"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accountsPayable_controller_1 = __importDefault(require("../controllers/accountsPayable.controller"));
const router = (0, express_1.Router)();
router.get("/", accountsPayable_controller_1.default.getAll.bind(accountsPayable_controller_1.default));
router.post("/", accountsPayable_controller_1.default.create.bind(accountsPayable_controller_1.default));
router.put("/:id", accountsPayable_controller_1.default.update.bind(accountsPayable_controller_1.default));
router.delete("/:id", accountsPayable_controller_1.default.delete.bind(accountsPayable_controller_1.default));
exports.default = router;
