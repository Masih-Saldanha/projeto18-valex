import app from "./app.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

console.log(+process.env.PORT)
const port = +process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server up and listening on port ${port}`);
})