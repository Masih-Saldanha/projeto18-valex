import { findByApiKey } from "../repositories/companyRepository.js";

async function validateAPIKey(apiKey: string) {
    const existCompany = await findByApiKey(apiKey);
    if (!existCompany) {
        throw {
            type: "Not Found",
            message: "Invalid API key"
        };
    };
    return existCompany;
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
    };
};

const companyUtils = {
    validateAPIKey,
    validateEmployeeOnCompany
};

export default companyUtils;