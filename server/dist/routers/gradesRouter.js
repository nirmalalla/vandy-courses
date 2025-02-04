"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const grades_1 = require("../controllers/grades");
const middleware_1 = require("../middleware");
const gradesRouter = (0, express_1.Router)();
gradesRouter.get("/", grades_1.getAllGrades);
gradesRouter.get("/course", grades_1.getCourses);
gradesRouter.get("/course/:courseId", grades_1.getGradesByCourse);
gradesRouter.get("/profs/:courseId", grades_1.getProfs);
gradesRouter.post("/", middleware_1.authenticate, grades_1.addGrade);
gradesRouter.put("/", middleware_1.authenticate, grades_1.editGrade);
gradesRouter.delete("/", middleware_1.authenticate, grades_1.deleteGrade);
exports.default = gradesRouter;
//# sourceMappingURL=gradesRouter.js.map