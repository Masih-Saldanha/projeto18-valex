import { update } from "../repositories/cardRepository.js";
import { insert } from "../repositories/paymentRepository.js";
import businessesUtils from "../utils/businessesUtils.js";
import cardUtils from "../utils/cardUtils.js";

async function buyWithCard(cardId: number, password: string, amount: number, businessId: number) {
    const existCard = await cardUtils.validateCard(cardId);
    if (!existCard.password) {
        throw {
            type: "Not Acceptable",
            message: `The card with the Id ${existCard.id} ins't activated yet`
        };
    }

    cardUtils.validateCardExpiration(existCard);

    if (existCard.isBlocked) {
        throw {
            type: "Not Acceptable",
            message: `The card with the Id ${existCard.id} is blocked`
        };
    }

    cardUtils.decryptPassword(password, existCard.password);

    const businesses = await businessesUtils.validateBusinessesId(businessId);

    if (existCard.type !== businesses.type) {
        throw {
            type: "Not Acceptable",
            message: `The card with the Id ${existCard.id} can't be used on the businesses ${businesses.name} because they don't share the same type => Card(${existCard.type}) !== Businesses(${businesses.type})`
        };
    }

    const totalAmountAvailable = await cardUtils.validateCardRechargeAmount(cardId);
    if (amount > totalAmountAvailable.balance) {
        throw {
            type: "Not Acceptable",
            message: `The card with the Id ${cardId} doesn't have enough money to complete the transation. Card amount: ${totalAmountAvailable}; Shopping value: ${amount}`
        };
    }

    await insert({ cardId, businessId, amount });
}

async function cardData(cardId: number) {
    await cardUtils.validateCard(cardId);
    return await cardUtils.validateCardRechargeAmount(cardId);
}

async function blockCard(cardId: number, password: string) {
    const existCard = await cardUtils.validateCard(cardId);

    cardUtils.validateCardExpiration(existCard);

    if (existCard.isBlocked) {
        throw {
            type: "Not Acceptable",
            message: `The card with the Id ${existCard.id} is already blocked`
        };
    }

    cardUtils.decryptPassword(password, existCard.password);

    await update(cardId, { isBlocked: true });
}

async function unblockCard(cardId: number, password: string) {
    const existCard = await cardUtils.validateCard(cardId);

    cardUtils.validateCardExpiration(existCard);

    if (!existCard.isBlocked) {
        throw {
            type: "Not Acceptable",
            message: `The card with the Id ${existCard.id} is not blocked`
        };
    }

    cardUtils.decryptPassword(password, existCard.password);

    await update(cardId, { isBlocked: false });
}

const employeeService = {
    buyWithCard,
    cardData,
    blockCard,
    unblockCard
}

export default employeeService;