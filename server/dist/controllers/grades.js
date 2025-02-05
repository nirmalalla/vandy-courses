"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGrade = exports.editGrade = exports.addGrade = exports.getGradesByUserId = exports.getProfs = exports.getCourses = exports.getGradesByCourse = exports.getAllGrades = void 0;
const Grade_1 = __importDefault(require("../models/Grade"));
const sequelize_1 = require("sequelize");
const crypto_1 = __importDefault(require("crypto"));
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const checkTermVal = (data) => {
    const pattern = /^\d{2}[SF]$/;
    return pattern.test(data);
};
const getAllGrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const grades = yield Grade_1.default.findAll();
        res.status(200).json(grades);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllGrades = getAllGrades;
const getGradesByCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = req.params.courseId;
    try {
        if (!course) {
            res.status(400).json({ error: "Invalid courseId parameter" });
            return;
        }
        const grades = yield Grade_1.default.findAll({
            where: { course: course }
        });
        if (grades.length === 0) {
            res.status(404).json({ message: "No grades found for this courseId" });
            return;
        }
        res.status(200).json(grades);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getGradesByCourse = getGradesByCourse;
const getCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield Grade_1.default.findAll({
            attributes: [
                [sequelize_1.Sequelize.fn('DISTINCT', sequelize_1.Sequelize.col("course")), "course"]
            ],
            raw: true,
        });
        res.status(200).json(courses);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getCourses = getCourses;
const getProfs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = req.params.courseId;
    try {
        const professors = yield Grade_1.default.findAll({
            where: { course },
            attributes: [[sequelize_1.Sequelize.fn('DISTINCT', sequelize_1.Sequelize.col('prof')), 'prof']],
        });
        return res.json({ professors: professors.map((professor => professor.get('prof'))) });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error." });
    }
});
exports.getProfs = getProfs;
const getGradesByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    try {
        if (!userId) {
            res.status(400).json({ error: "invalid userId parameter" });
            return;
        }
        const grades = yield Grade_1.default.findAll({
            where: { userId: userId }
        });
        res.status(200).json(grades);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getGradesByUserId = getGradesByUserId;
const addGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { course, gradeReceived, prof, term } = req.body;
        const cookie = req.headers.cookie;
        if (!cookie) {
            res.status(401).json({ error: "No cookie found" });
            return;
        }
        // Find the userInfo cookie more reliably
        const userInfoMatch = cookie.match(/userInfo=([^;]+)/);
        if (!userInfoMatch) {
            res.status(401).json({ error: "User info not found in cookie" });
            return;
        }
        const encodedUserInfo = userInfoMatch[1];
        const decodedUserInfo = decodeURIComponent(encodedUserInfo);
        let userInfo;
        try {
            userInfo = JSON.parse(decodedUserInfo);
        }
        catch (e) {
            console.error('Cookie parsing error:', decodedUserInfo);
            res.status(400).json({ error: "Invalid cookie format" });
            return;
        }
        const email = userInfo.email;
        if (!email || email.substring(email.length - 14) !== "vanderbilt.edu") {
            res.status(401).json({ error: "non vanderbilt" });
            return;
        }
        const hashedEmail = crypto_1.default.createHash('sha256').update(email).digest("hex");
        if (!course.trim() || !gradeReceived.trim() || !prof.trim() || !term.trim() || !checkTermVal(term.trim())) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }
        yield Grade_1.default.sync({ alter: true });
        const newGrade = yield Grade_1.default.create({
            userId: hashedEmail,
            course,
            gradeReceived,
            prof,
            term
        });
        res.status(201).json(newGrade);
    }
    catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.addGrade = addGrade;
const editGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, gradeReceived, prof, term } = req.body;
    const userId = req.user;
    try {
        const grade = Grade_1.default.findAll({ where: { id, userId } });
        if (!grade) {
            res.status(404).json({ error: "Grade not found or not authorized to edit this grade." });
        }
        yield Grade_1.default.update({ gradeReceived, prof, term }, { where: { id } });
        res.status(200).json({ message: "grade updated successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.editGrade = editGrade;
const deleteGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const userId = req.user;
    try {
        const grade = Grade_1.default.findAll({ where: { id, userId } });
        if (!grade) {
            res.status(404).json({ error: "Grade not found or not authorized to delete this grade" });
        }
        yield Grade_1.default.destroy({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteGrade = deleteGrade;
//# sourceMappingURL=grades.js.map