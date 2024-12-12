import { Router } from "express";
import { getAllGrades, addGrade, getGradesByCourse, editGrade, deleteGrade } from "../controllers/grades";
import { authenticateToken } from "../middleware";

const gradesRouter = Router();

gradesRouter.get("/", getAllGrades);
gradesRouter.get("/course/:courseId", getGradesByCourse);
gradesRouter.post("/", authenticateToken, addGrade);
gradesRouter.put("/", authenticateToken, editGrade);
gradesRouter.delete("/", authenticateToken, deleteGrade);

export default gradesRouter;