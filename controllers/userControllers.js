import * as fs from "node:fs/promises";
import path from "node:path";
import jimp from "jimp"; 

import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import { validateUserSchema } from "../schemas/userSchemas.js";
import mail from "../mail.js";

async function changeAvatar(req, res, next) {

    try {

        if (!req.file) {
            return next(HttpError(400));
        }

        const filename = req.file.filename;
        const newPath = path.resolve("public", "avatars", filename);

        await fs.rename(req.file.path, newPath);

        
        const image = await jimp.read(newPath);
        await image.resize(250, 250).writeAsync(newPath);


        const avatarURL = path.join("/avatars", filename);

        await User.findByIdAndUpdate(
            req.user.id,
            { avatarURL }, 
            { new: true }
        );

        res.status(200).send({avatarURL})
    } catch (error) {
        next(error);
    }
}

async function verifyEmail(req, res, next) {

    try {
        const{token} = req.params;
  
        const user = await User.findOne({verificationToken: token});
  
        if(user === null) {
            return next(HttpError(404, "User not found"));
        };

        await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: null})

        res.status(200).send({message: "Verification successful"});
    
    } catch (error) {
        next(error)
    }
}


async function reverifyEmail(req, res, next) {
    try {

        const {email} = req.body;

        if (!email) {
            return next(HttpError(400, "missing required field email"));
        };


        const body ={
            email: req.body.email,
        };

        const { error, value } = validateUserSchema.validate(body);

        if (error) {
            return next(HttpError(400, "missing required field email"));
        };


        const user = await User.findOne({email: email});

        if (user.verify === true) {
            return next(HttpError(400, "Verification has already been passed"));
        };


        const verificationToken = user.verificationToken; 

        mail.sendMail({
            to: email,
            from: "svitlanaoseichuk@gmail.com",
            subject: "welcome",
            html: `to confirm your email click on <a href="http://localhost:3000/users/verify/${verificationToken}">link</a>`,
            text: `to confirm your email open the link http://localhost:3000/users/verify/${verificationToken}`
        });

        
        res.status(200).send({message: "Verification email sent"});

    } catch (error) {
        next(error);
    }
}

export default {
  changeAvatar,
  verifyEmail,
  reverifyEmail
};