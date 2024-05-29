import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";
import { authSchema } from "../schemas/authSchemas.js";



async function register(req, res, next) {
    try{

        const {email, password} = req.body;

        const userData = {
            email: req.body.email,
            password: req.body.password
        } 

        
        const { error, value } = authSchema.validate(userData);

        if (error) {
            return next(HttpError(400, error.message));
        }


        const user = await User.findOne({email});
    
        if (user !== null) {
            return next(HttpError(409, "Email in use"));
        }


        const passwordHash = await bcrypt.hash(password, 10);
       
        await User.create({ email, password: passwordHash});

    
        res.status(201).json({ user: { email: email, password: password } });

    } catch(error) {

         next(error)
    }
}



async function login(req, res, next) {
    try {
        const {email, password} = req.body;

        const userData = {
            email: req.body.email,
            password: req.body.password
        } 

        
        const { error, value } = authSchema.validate(userData);

        if (error) {
            return next(HttpError(400, error.message));
        }


        const user = await User.findOne({email});
        
        if (user === null) {
            return next(HttpError(401, "Email or password is wrong"));
        }


        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch === false) {
            return next(HttpError(401, "Email or password is wrong"));
        }


        const token = jwt.sign(
            {id: user._id, email: user.email},
            process.env.JWT_SECRET, 
            { expiresIn: 3600}
        );

        await User.findByIdAndUpdate(user.id, {token}, {new: true});
        
        res.status(200).json({token, user: { email: email, subscription: user.subscription } });

    } catch (error) {
        
        next(error);
    }
}



async function logout(req, res, next) {

    try {

        await User.findByIdAndUpdate(req.user.id, {token: null});
        
        res.status(200).end();

    } catch (error) {

        next(error);        
    }
}



async function current(req, res, next) {

    try{
        const { email } = req.user;

        const user = await User.findOne({email});

        res.status(200).json({ email: email, subscription: user.subscription });

    } catch(error) {

        next(error)
    }
}

export default {register, login, logout, current}