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
    const { courseId } = req.params; 
    
    try { 
        if (!courseId || isNaN(Number(courseId))){
            res.status(400).json({error: "Invalid courseId parameter"});
            return;
        }

        const grades = await Grade.findAll({
            where: { courseId: Number(courseId)}
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

export const addGrade = async (req: Request, res: Response): Promise<void> => {
    const { userId, courseId, gradeReceived } = req.body;

    try {
        if (!userId || !courseId || !gradeReceived){
            res.status(400).json({error: "All fields are required"});
            return;
        }

        const newGrade = await Grade.create({
            userId,
            courseId,
            gradeReceived
        });

        res.status(201).json(newGrade);
    } catch (error){
        res.status(500).json({error: error.message});
    }
}
