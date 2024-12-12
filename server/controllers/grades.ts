import { Request, Response } from "express";
import Grade from "../models/Grade";
import { copyFileSync } from "fs";

export const getAllGrades = async(req: Request, res: Response): Promise<void> => {
    try {
        const grades = await Grade.findAll();
        res.status(200).json(grades);
    } catch (error){
        res.status(500).json({error: error.message});
    }
}

export const getGradesByCourse = async(req: Request, res: Response): Promise<void> => {
    const { course } = req.params; 
    
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

export const getGradesByUserId = async(req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

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
    const { userId, course, gradeReceived } = req.body;

    try {
        await Grade.sync({alter: true});

        if (!userId || !course || !gradeReceived){
            res.status(400).json({error: "All fields are required"});
            return;
        }

        const newGrade = await Grade.create({
            userId,
            course,
            gradeReceived
        });

        res.status(201).json(newGrade);
    } catch (error){
        res.status(500).json({error: error.message});
    }
}

