import { insert, TransactionTypes, update } from "../repositories/cardRepository.js";
import { insert as insertRecharge } from "../repositories/rechargeRepository.js";
import cardUtils from "../utils/cardUtils.js";
import companyUtils from "../utils/companyUtils.js";
import employeeUtils from "../utils/employeeUtils.js";

async function createCard(apiKey: string, employeeId: number, type: TransactionTypes) {
    const existCompany = await companyUtils.validateAPIKey(apiKey);

    const existEmployee = await employeeUtils.validateEmployee(employeeId);

    companyUtils.validateEmployeeOnCompany(existEmployee, existCompany);

    const cardHolderName = employeeUtils.createCardHolderName(existEmployee.fullName);

    await employeeUtils.validateNotRepeatedCardType(type, existEmployee.id);

    const cardNumberAndExpirationDate = await cardUtils.createCardNumber(cardHolderName);

    const cardCVV = cardUtils.createCardCVV();

    const cardData = {
        employeeId,
        number: cardNumberAndExpirationDate.cardNumber,
        cardholderName: cardHolderName,
        securityCode: cardCVV.encryptedCVV,
        expirationDate: cardNumberAndExpirationDate.expirationDate,
        password: null,
        isVirtual: false,
        originalCardId: null,
        isBlocked: false,
        type,
    };

    await insert(cardData);
};

async function activateCard(cardId: number, securityCode: string, password: string) {
    const existCard = await cardUtils.validateCard(cardId);

    cardUtils.validateCardExpiration(existCard);

    if (existCard.password) {
        throw {
            type: "Conflict",
            message: `The card with the Id ${existCard.id} has already been activated and can't be activated again`
        };
    }

    const decryptSecurityCode = cardUtils.decryptCardCVV(existCard.securityCode);

    cardUtils.validateCardCVV(decryptSecurityCode, securityCode);

    const encryptedPassword = employeeUtils.createPassword(password);

    await update(cardId, { password: encryptedPassword });
};

async function rechargeCardById(cardId: number, amount: number) {
    const existCard = await cardUtils.validateCard(cardId);
    if (!existCard.password) {
        throw {
            type: "Not Acceptable",
            message: `The card with the Id ${existCard.id} ins't activated yet, so it can't be recharged`
        };
    }

    cardUtils.validateCardExpiration(existCard);

    await insertRecharge({ amount, cardId });
};

const cardService = {
    createCard,
    activateCard,
    rechargeCardById
};

export default cardService;