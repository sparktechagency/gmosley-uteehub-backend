import jwt, { JwtPayload, Secret } from "jsonwebtoken";


const createToken = (payload: Record<string, unknown>, setret: Secret, expiresTime: string): string => {
    return jwt.sign(payload, setret, {
        expiresIn: expiresTime
    })
}


const verifyToken = (token: string, secret: Secret): JwtPayload => {
    return jwt.verify(token, secret) as JwtPayload;
}

const jwtHelpers = {
    createToken,
    verifyToken,
}

export default jwtHelpers