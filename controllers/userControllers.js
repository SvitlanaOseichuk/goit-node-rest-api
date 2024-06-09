import * as fs from "node:fs/promises";
import path from "node:path";
import jimp from "jimp"; 

import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

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


        const avatarURL = `/avatars/${filename}`;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { avatarURL }, 
            { new: true }
        );

        res.status(200).send({avatarURL})
    } catch (error) {
        next(error);
    }
}

export default {
  changeAvatar
};