import express, { Application } from "express";
const cors = require("cors");
import gradesRouter from "../routers/gradesRouter";
import usersRouter from "../routers/usersRouter";
import sequelize from "../config/database";

const app: Application = express();
const PORT = 5000;

app.use(express.json());

app.use(cors({
    origin: "https://vandy-courses-three.vercel.app/",
    credentials: true
}));

const startApp = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("Database synced");
    } catch (error) {
        console.error("error syncing db: ", error);
    }
}

startApp();

app.use("/api/grades", gradesRouter);
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});