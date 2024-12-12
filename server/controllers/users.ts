import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";

export const createNewUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        if (!email || !password){
            res.status(400).json({error: "invalid params"});
            return;
        }
        
        User.sync({alter: true});
        
        const existingUser = await User.findOne({where: { email }});
        if (existingUser) {
            res.status(400).json({error: "Email already in use"});
            return;
        }

        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);


        const user = User.create({
            email,
            password_hash,
        });

        res.status(201).json({message: "User created successfully"});

    } catch (error){
        res.status(500).json({error: error.message});
    }


}