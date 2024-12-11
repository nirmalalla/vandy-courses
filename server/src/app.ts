import express, { Application } from "express";
import gradesRouter from "../routers/gradesRouter";

const app: Application = express();
const PORT = 5000;

app.use(express.json());

app.use("/api/grades", gradesRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});