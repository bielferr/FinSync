"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountPayable = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = __importDefault(require("./user.model"));
let AccountPayable = class AccountPayable extends sequelize_typescript_1.Model {
};
exports.AccountPayable = AccountPayable;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], AccountPayable.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.FLOAT,
        allowNull: false,
        validate: { min: 0 }
    }),
    __metadata("design:type", Number)
], AccountPayable.prototype, "amount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], AccountPayable.prototype, "dueDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('pending', 'paid'),
        allowNull: false,
        defaultValue: 'pending',
    }),
    __metadata("design:type", String)
], AccountPayable.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], AccountPayable.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.default),
    __metadata("design:type", user_model_1.default)
], AccountPayable.prototype, "user", void 0);
exports.AccountPayable = AccountPayable = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'accounts_payable',
        timestamps: true,
    })
], AccountPayable);
exports.default = AccountPayable;
