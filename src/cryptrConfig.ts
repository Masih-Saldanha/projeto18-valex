import Cryptr from "cryptr";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const cryptr = new Cryptr(process.env.CRYPTR_KEY);

export default cryptr;