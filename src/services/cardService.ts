import dayjs from "dayjs";
import { faker } from "@faker-js/faker";

import { findByCardDetails, findByTypeAndEmployeeId, insert, TransactionTypes } from "../repositories/cardRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import { findById } from "../repositories/employeeRepository.js";
import cryptr from "../cryptrConfig.js";

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
}

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

async function createCardNumber(cardHolderName : string) {
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
}

function createCardCVV() {
    const CVV = faker.finance.creditCardCVV();
    const encryptedCVV = cryptr.encrypt(CVV);
    // const decryptedCVV = cryptr.decrypt("encryptedCVV");
    return {
        CVV,
        encryptedCVV
    };
}

async function createCard(apiKey : string, employeeId : number, type : TransactionTypes) {
    const existCompany = await validateAPIKey(apiKey);
    // console.log(existCompany);

    const existEmployee = await validateEmployee(employeeId);
    // console.log(existEmployee);

    validateEmployeeOnCompany(existEmployee, existCompany);

    const cardHolderName = createCardHolderName(existEmployee.fullName);
    // console.log(cardHolderName);

    await validateNotRepeatedCardType(type, existEmployee.id);

    const cardNumberAndExpirationDate = await createCardNumber(cardHolderName);
    // console.log(cardNumberAndExpirationDate);

    const cardCVV = createCardCVV();
    // console.log(cardCVV);
    
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
    }

    await insert(cardData);
}

const cardService = {
    createCard
}

export default cardService;