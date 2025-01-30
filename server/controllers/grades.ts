import { Request, Response } from "express";
import Grade from "../models/Grade";
import { Sequelize } from "sequelize";
import crypto from "crypto";

export const getAllGrades = async(req: Request, res: Response): Promise<void> => {
    try {
        const grades = await Grade.findAll();
        res.status(200).json(grades);
    } catch (error){
        res.status(500).json({error: error.message});
    }
}


export const getGradesByCourse = async(req: Request, res: Response): Promise<void> => {
    const course = req.params.courseId; 
    try { 
        if (!course){
            res.status(400).json({error: "Invalid courseId parameter"});
            return;
        }

        const grades = await Grade.findAll({
            where: { course: course}
        });

        if (grades.length === 0){
            res.status(404).json({message: "No grades found for this courseId"});
            return;
        }

        res.status(200).json(grades);
    } catch (error){
        res.status(500).json({error: error.message});
    }

}

export const getCourses = async(req: Request, res: Response): Promise<void> => {
    try {
        const courses = await Grade.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col("course")), "course"]
            ],
            raw: true,
        });

        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getProfs = async(req: Request, res: Response): Promise<void> => {
    const course = req.params.courseId;


    try{
        const professors = await Grade.findAll({
            where: { course },
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('prof')), 'prof']],
        });

        return res.json({professors: professors.map((professor => professor.get('prof')))},);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "internal server error."});
    }
}

export const getGradesByUserId = async(req: Request, res: Response): Promise<void> => {
    const { userId } = req.user;

    try { 
        if (!userId){
            res.status(400).json({error: "invalid userId parameter"});
            return;
        }

        const grades = await Grade.findAll({
            where: {userId: userId}
        });
        res.status(200).json(grades);
    } catch (error){
        res.status(500).json({error: error.message});
    }
}

export const addGrade = async (req: Request, res: Response): Promise<void> => {
    try {
        const { course, gradeReceived, prof, term } = req.body;
        const cookie: string = req.headers.cookie;
        
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
        } catch (e) {
            console.error('Cookie parsing error:', decodedUserInfo);
            res.status(400).json({ error: "Invalid cookie format" });
            return;
        }

        const email = userInfo.email;

        if (!email || email.substring(email.length - 14) !== "vanderbilt.edu") {
            res.status(401).json({ error: "non vanderbilt" });
            return;
        }

        const hashedEmail = crypto.createHash('sha256').update(email).digest("hex");

        if (!course || !gradeReceived || !prof || !term) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }

        await Grade.sync({ alter: true });

        const newGrade = await Grade.create({
            userId: hashedEmail,
            course,
            gradeReceived,
            prof,
            term
        });

        res.status(201).json(newGrade);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const editGrade = async (req: Request, res: Response): Promise<void> => {
    const { id, gradeReceived, prof, term } = req.body;
    const userId = req.user;

    try {
        const grade = Grade.findAll({where: { id, userId }});

        if (!grade) {
            res.status(404).json({ error: "Grade not found or not authorized to edit this grade."});
        }

        await Grade.update({ gradeReceived, prof, term }, { where: { id }});
        
        res.status(200).json({message: "grade updated successfully"});
    } catch (error){
        res.status(500).json({ error: error.message });
    }
}

export const deleteGrade = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.body;
    const userId = req.user;

    try {
        const grade = Grade.findAll({where: { id, userId }});

        if (!grade) {
            res.status(404).json({error: "Grade not found or not authorized to delete this grade"});
        }

        await Grade.destroy({ where: { id }});
        
        res.status(204).send();
    } catch (error){
        res.status(500).json({ error: error.message });
    }
}