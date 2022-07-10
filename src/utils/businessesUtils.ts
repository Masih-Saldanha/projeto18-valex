import { findById } from "../repositories/businessRepository.js";

async function validateBusinessesId(businessesId: number) {
    const existBusinesses = await findById(businessesId);
    if (!existBusinesses) {
        throw {
            type: "Not Found",
            message: `The businesses with the id ${businessesId} doesn't exist`
        };
    }
    return existBusinesses;
};

const businessesUtils = {
    validateBusinessesId
}

export default businessesUtils;