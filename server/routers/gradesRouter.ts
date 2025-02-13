import { Router } from "express";
import { getAllGrades, addGrade, getGradesByCourse, editGrade, deleteGrade, getCourses, getProfs } from "../controllers/grades";
import { authenticate } from "../middleware";

const gradesRouter = Router();

gradesRouter.get("/", getAllGrades);
gradesRouter.get("/course", getCourses);
gradesRouter.get("/course/:courseId", getGradesByCourse);
gradesRouter.get("/profs/:courseId", getProfs);
gradesRouter.post("/", authenticate, addGrade);
gradesRouter.put("/", authenticate, editGrade);
gradesRouter.delete("/", authenticate, deleteGrade);

export default gradesRouter;