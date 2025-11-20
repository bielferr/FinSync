"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCard = exports.updateCard = exports.createCard = exports.getCards = void 0;
const cards_model_1 = require("../models/cards.model");
const getCards = async () => {
    return cards_model_1.Card.findAll();
};
exports.getCards = getCards;
const createCard = async (data) => {
    // `data` should not include id or balance; balance will default to 0
    const created = await cards_model_1.Card.create(data);
    return created;
};
exports.createCard = createCard;
const updateCard = async (id, data) => {
    const card = await cards_model_1.Card.findByPk(id);
    if (!card)
        return null;
    await card.update(data);
    return card;
};
exports.updateCard = updateCard;
const deleteCard = async (id) => {
    const card = await cards_model_1.Card.findByPk(id);
    if (!card)
        return null;
    await card.destroy();
    return card;
};
exports.deleteCard = deleteCard;
