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
    if (amount > totalAmountAvailable) {
        throw {
            type: "Not Acceptable",
            message: `The card with the Id ${cardId} doesn't have enough money to complete the transation. Card amount: ${totalAmountAvailable}; Shopping value: ${amount}`
        };
    }

    await insert({ cardId, businessId, amount });
}

const employeeService = {
    buyWithCard
}

export default employeeService;