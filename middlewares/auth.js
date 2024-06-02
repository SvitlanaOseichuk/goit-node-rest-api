import jwt from "jsonwebtoken"

import User from "../models/user.js"
import HttpError from "../helpers/HttpError.js";



function auth(req, res, next) {
    
    const authorizationHeader = req.headers.authorization;

    if (typeof authorizationHeader !== "string") {
        return next(HttpError(401, "Not authorized"));
    }


    const [bearer, token] = authorizationHeader.split(" ", 2);

    if (bearer !== "Bearer") {
        return next(HttpError(401, "Not authorized"));
    }

    
    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {

        if (err) {            
            return next(HttpError(401, "invalid token"));
        }

        
        try {

            const user = await User.findById(decode.id);
 
             if (user === null) {
               return next(HttpError(401, "invalid token"));
             }
 
            
             if (user.token !== token) {
               return next(HttpError(401, "invalid token"));
             }
 

            req.user = { id: decode.id, email: decode.email}

            next();
        } catch (error) {
            next(error);
        }
    })


}
export default auth;