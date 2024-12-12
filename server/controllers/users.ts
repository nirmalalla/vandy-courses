import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({path: path.resolve(process.cwd(), ".env")});

export const createNewUser = async (req: Request, res: Response): Promise<void> => { const { email, password } = req.body;
    try {
        if (!email || !password){
            res.status(400).json({error: "invalid params"});
            return;
        }
        
        await User.sync({alter: true});
        
        const existingUser = await User.findOne({where: { email }});
        if (existingUser) {
            res.status(400).json({error: "Email already in use"});
            return;
        }

        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);


        User.create({
            email,
            password_hash,
        });

        res.status(201).json({message: "User created successfully"});

    } catch (error){
        res.status(500).json({error: error.message});
    }


}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({where: { email }});

        if (!user){
            res.status(401).json({error: "invalid email"});
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch){
            res.status(401).json({error: "invalid email or password"});
        }

        const token = jwt.sign({id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h"});

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

