import { Request, Response } from "express";
import Grade from "../models/Grade";
import { Sequelize } from "sequelize";
import sequelize from "sequelize";
import { createHash, hash } from "crypto";

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
        res.json(500).json({error: error.message});
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
    const { course, gradeReceived, prof, term } = req.body;

    const cookie: string = req.headers.cookie;
    const userId = cookie.substring(cookie.indexOf("userInfo") + 9);
    const decoded = decodeURIComponent(userId);
    const email: string = JSON.parse(decoded).email;

    if (email.substring(email.length - 14) !== "vanderbilt.edu"){
        res.status(401).json({error: "non vanderbilt"});
        return;
    }

    const hashedEmail = createHash('sha256').update(email).digest("hex");

    try {
        await Grade.sync({alter: true});

        if (!userId || !course || !gradeReceived || !prof || !term){
            res.status(400).json({error: "All fields are required"});
            return;
        }

        const newGrade = await Grade.create({
            userId: hashedEmail,
            course,
            gradeReceived,
            prof,
            term
        });

        res.status(201).json(newGrade);
    } catch (error){
        res.status(500).json({error: error.message});
    }
}

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