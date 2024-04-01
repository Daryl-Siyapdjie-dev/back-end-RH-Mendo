import logging from "../config/logging";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/user.interface";
import config from "../config/config";


const NAMESPACE ='Auth';

const signJWT = (user: IUser, callback: (error: Error|null, token: String|null)=>void):void=>{
    let timeSinchEpoch = new Date().getTime();
    let expirationTime = timeSinchEpoch + Number(config.server.token.expireTime) * 10000
    let expirationTimeSeconds = Math.floor(expirationTime / 1000);

    
    logging.info(NAMESPACE, `Attempting to sign token for ${user._id}`);

    try {
        jwt.sign(
            {
                matricule: user.matricule
            },
            config.server.token.secret,
            {
                issuer: config.server.token.issuer,
                algorithm: 'HS256',
                expiresIn: expirationTimeSeconds
            },
            (error, token) => {
                if (error) {
                    callback(error, null);
                } else if (token) {
                    callback(null, token);
                }
            }
        );
    } catch (error) {
        logging.error(NAMESPACE, error.message, error);
        callback(error, null);
    }
};


export default signJWT;