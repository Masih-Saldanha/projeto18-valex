import app from "./app.js";
import dotenv from "dotenv";
dotenv.config({ path: "src/.env" });

const port = +process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server up and listening on port ${port}`);
})