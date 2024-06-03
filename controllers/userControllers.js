import * as fs from "node:fs/promises";
import path from "node:path";
import jimp from "jimp"; 

import User from "../models/user.js";

async function changeAvatar(req, res, next) {

    try {
        const newPath = path.resolve("public", "avatars", req.file.filename);

        await fs.rename(req.file.path, newPath);

        const image = await jimp.read(newPath);
        await image.resize(250, 250).writeAsync(newPath);

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {avatarURL: req.file.filename},
            {new: true},
        )
        res.status(200).send({avatarURL: user.avatarURL})
    } catch (error) {
        next(error);
    }
}

export default {
  changeAvatar
};