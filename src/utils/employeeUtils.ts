import bcrypt from "bcrypt";

import { findByTypeAndEmployeeId, TransactionTypes } from "../repositories/cardRepository.js";
import { findById } from "../repositories/employeeRepository.js";

async function validateEmployee(employeeId: number) {
    const existEmployee = await findById(employeeId);
    if (!existEmployee) {
        throw {
            type: "Not Found",
            message: "Invalid Employee Id"
        };
    };
    return existEmployee;
};

async function validateNotRepeatedCardType(type: TransactionTypes, employeeId: number) {
    const cardRepeated = await findByTypeAndEmployeeId(type, employeeId);
    if (cardRepeated) {
        throw {
            type: "Conflict",
            message: `Employee ${cardRepeated.cardholderName} already have a ${cardRepeated.type} type card`
        };
    };
};

function createCardHolderName(employeeFullName: string) {
    const stringIntoArray = employeeFullName.split(" ");
    const arrayMinusShortWords = stringIntoArray.filter(word => word.length > 3);
    const filteredArray = arrayMinusShortWords.map((word, index) => {
        if (index !== 0 && index !== arrayMinusShortWords.length - 1) {
            return word[0];
        };
        return word;
    });
    const cardHolderName = filteredArray.join(" ");
    return cardHolderName;
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
    };
};

const employeeUtils = {
    validateEmployee,
    validateNotRepeatedCardType,
    createCardHolderName,
    createPassword,
    decryptPassword
};

export default employeeUtils;