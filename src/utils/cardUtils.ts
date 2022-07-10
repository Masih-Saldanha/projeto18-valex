import dayjs from "dayjs";
import { faker } from "@faker-js/faker";

import cryptr from "../cryptrConfig.js";
import { findByCardDetails, findById as findByIdCard, Card } from "../repositories/cardRepository.js";
import { findByCardId } from "../repositories/rechargeRepository.js";
import { findByCardId as findByCardIdPayment } from "../repositories/paymentRepository.js";

const cardPasswordRegex = /^[0-9]{4}$/;

async function createCardNumber(cardHolderName: string) {
    let cardNumber = faker.finance.creditCardNumber('#### #### #### ####');
    const expirationDate = dayjs(Date.now()).add(5, "year").format("MM/YY");
    let existCardNumber = await findByCardDetails(cardNumber, cardHolderName, expirationDate);
    while (existCardNumber) {
        cardNumber = faker.finance.creditCardNumber('#### #### #### ####');
        existCardNumber = await findByCardDetails(cardNumber, cardHolderName, expirationDate);
    };

    return {
        cardNumber,
        expirationDate
    };
};

function createCardCVV() {
    const CVV = faker.finance.creditCardCVV();
    const encryptedCVV = cryptr.encrypt(CVV);
    return {
        CVV,
        encryptedCVV
    };
};

async function validateCard(cardId: number) {
    const existCard = await findByIdCard(cardId);
    if (!existCard) {
        throw {
            type: "Not Found",
            message: `The card Id ${cardId} doesn't exist`
        };
    }
    return existCard;
};

function validateCardExpiration(card: Card) {
    const expirationMonth = card.expirationDate.split("/")[0];
    const expirationYear = card.expirationDate.split("/")[1];
    const expirationFullDate = `20${expirationYear}/${expirationMonth}/01`;

    const dateNow = dayjs(Date.now()).format("YYYY/MM/DD");
    const dateExpiration = dayjs(expirationFullDate).format("YYYY/MM/DD");

    const date1 = dayjs(dateNow);
    const date2 = dayjs(dateExpiration);

    const dateDifference = date2.diff(date1);
    if (dateDifference <= 0) {
        throw {
            type: "Not Acceptable",
            message: `The card with the Id ${card.id} has already expired`
        };
    };
};

function decryptCardCVV(securityCodeFromTable: string) {
    return cryptr.decrypt(securityCodeFromTable);
};

function validateCardCVV(securityCodeFromTable: string, securityCodeFromHeaders: string) {
    if (securityCodeFromTable !== securityCodeFromHeaders) {
        throw {
            type: "Not Found",
            message: `The sended card CVV doesn't match with the registered in the system`
        };
    };
};

async function validateCardRechargeAmount(cardId: number) {
    const cardPaymentList = await findByCardIdPayment(cardId);
    const cardRechargeList = await findByCardId(cardId);
    let totalAmountAvailable = 0;

    cardPaymentList.forEach(recharge => totalAmountAvailable -= recharge.amount);
    cardRechargeList.forEach(recharge => totalAmountAvailable += recharge.amount);

    return {
        balance: totalAmountAvailable,
        transactions: cardPaymentList,
        recharges: cardRechargeList
    };
};

const cardUtils = {
    cardPasswordRegex,
    createCardNumber,
    createCardCVV,
    validateCard,
    validateCardExpiration,
    decryptCardCVV,
    validateCardCVV,
    validateCardRechargeAmount
};

export default cardUtils;