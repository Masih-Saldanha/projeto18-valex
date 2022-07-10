import dayjs from "dayjs";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

import cryptr from "../cryptrConfig.js";
import { findByCardDetails, findByTypeAndEmployeeId, TransactionTypes, findById as findByIdCard, Card } from "../repositories/cardRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import { findById } from "../repositories/employeeRepository.js";
import { findByCardId } from "../repositories/rechargeRepository.js";
import { findByCardId as findByCardIdPayment } from "../repositories/paymentRepository.js";

const cardPasswordRegex = /^[0-9]{4}$/;

async function validateAPIKey(apiKey: string) {
    const existCompany = await findByApiKey(apiKey);
    if (!existCompany) {
        throw {
            type: "Not Found",
            message: "Invalid API key"
        };
    }
    return existCompany;
};

async function validateEmployee(employeeId: number) {
    const existEmployee = await findById(employeeId);
    if (!existEmployee) {
        throw {
            type: "Not Found",
            message: "Invalid Employee Id"
        };
    }
    return existEmployee;
};

function validateEmployeeOnCompany(
    employee: { companyId: number, fullName: string },
    company: { name: string, id: number }
) {
    if (employee.companyId !== company.id) {
        throw {
            type: "Unauthorized",
            message: `Employee ${employee.fullName} doens't work at the company ${company.name}`
        };
    }
};

async function validateNotRepeatedCardType(type: TransactionTypes, employeeId: number) {
    const cardRepeated = await findByTypeAndEmployeeId(type, employeeId);
    if (cardRepeated) {
        throw {
            type: "Conflict",
            message: `Employee ${cardRepeated.cardholderName} already have a ${cardRepeated.type} type card`
        };
    }
};

function createCardHolderName(employeeFullName: string) {
    const stringIntoArray = employeeFullName.split(" ");
    const arrayMinusShortWords = stringIntoArray.filter(word => word.length > 3);
    const filteredArray = arrayMinusShortWords.map((word, index) => {
        if (index !== 0 && index !== arrayMinusShortWords.length - 1) {
            return word[0]
        }
        return word;
    })
    const cardHolderName = filteredArray.join(" ");
    return cardHolderName;
};

async function createCardNumber(cardHolderName: string) {
    let cardNumber = faker.finance.creditCardNumber('#### #### #### ####');
    const expirationDate = dayjs(Date.now()).add(5, "year").format("MM/YY");
    let existCardNumber = await findByCardDetails(cardNumber, cardHolderName, expirationDate);
    while (existCardNumber) {
        cardNumber = faker.finance.creditCardNumber('#### #### #### ####');
        existCardNumber = await findByCardDetails(cardNumber, cardHolderName, expirationDate);
    }
    // console.log(cardNumber);
    // console.log(expirationDate);
    // console.log(existCardNumber);
    return {
        cardNumber,
        expirationDate
    }
};

function createCardCVV() {
    const CVV = faker.finance.creditCardCVV();
    const encryptedCVV = cryptr.encrypt(CVV);
    // const decryptedCVV = cryptr.decrypt("encryptedCVV");
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
    // console.log(dayjs(Date.now()).format("MM/YY"))
    // console.log(card.expirationDate);
    const expirationMonth = card.expirationDate.split("/")[0];
    const expirationYear = card.expirationDate.split("/")[1];
    const expirationFullDate = `20${expirationYear}/${expirationMonth}/01`;
    const dateNow = dayjs(Date.now()).format("YYYY/MM/DD");
    const dateExpiration = dayjs(expirationFullDate).format("YYYY/MM/DD");
    // console.log(dateNow);
    // console.log(dateExpiration);
    const date1 = dayjs(dateNow);
    const date2 = dayjs(dateExpiration);
    // console.log(date1);
    // console.log(date2);
    const dateDifference = date2.diff(date1);
    // console.log(dateDifference);
    if (dateDifference <= 0) {
        throw {
            type: "Not Acceptable",
            message: `The card with the Id ${card.id} has already expired`
        };
    }
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
    }
};

function createPassword(password: string) {
    return bcrypt.hashSync(password, +process.env.BCRYPT_SALT);
};

function decryptPassword(password: string, encryptedPassword: string) {
    const passwordVerification = bcrypt.compareSync(password, encryptedPassword);
    if (!passwordVerification) {
        throw {
            type: "Unauthorized",
            message: `Wrong password, try again`
        };
    }
}

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
}

const cardUtils = {
    cardPasswordRegex,
    validateAPIKey,
    validateEmployee,
    validateEmployeeOnCompany,
    validateNotRepeatedCardType,
    createCardHolderName,
    createCardNumber,
    createCardCVV,
    validateCard,
    validateCardExpiration,
    decryptCardCVV,
    validateCardCVV,
    createPassword,
    decryptPassword,
    validateCardRechargeAmount
}

export default cardUtils;