import { Router } from "express";
import { getAllGrades, addGrade, getGradesByCourse, editGrade, deleteGrade, getCourses } from "../controllers/grades";
import { authenticateToken, authenticate } from "../middleware";

const gradesRouter = Router();

gradesRouter.get("/", getAllGrades);
gradesRouter.get("/course", getCourses);
gradesRouter.get("/course/:courseId", getGradesByCourse);
gradesRouter.post("/", authenticate, addGrade);
gradesRouter.put("/", authenticate, editGrade);
gradesRouter.delete("/", authenticate, deleteGrade);

export default gradesRouter;