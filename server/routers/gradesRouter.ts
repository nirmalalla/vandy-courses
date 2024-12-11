import { Router } from "express";
import { getAllGrades, addGrade, getGradesByCourse } from "../controllers/grades";

const gradesRouter = Router();

gradesRouter.get("/", getAllGrades);
gradesRouter.get("/course/:courseId", getGradesByCourse);
gradesRouter.post("/", addGrade);

export default gradesRouter;