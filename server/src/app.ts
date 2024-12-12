import express, { Application } from "express";
import gradesRouter from "../routers/gradesRouter";
import usersRouter from "../routers/usersRouter";

const app: Application = express();
const PORT = 5000;

app.use(express.json());

app.use("/api/grades", gradesRouter);
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});