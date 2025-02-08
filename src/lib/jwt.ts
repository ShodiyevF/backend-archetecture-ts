import jwt from 'jsonwebtoken'

import internalErrorCatcher from '@shared/logger/logger.internal';

namespace JWT {

    const expiration = process.env.JWT_EXPIRATION ? +process.env.JWT_EXPIRATION : 0
    const secretCode = process.env.JWT_SECRET ? process.env.JWT_SECRET : ''
    
    export function requestJwtToken(payload: object) {
        try {
            const token = jwt.sign(payload, secretCode, {
                expiresIn: expiration,
            });
            return token;
        } catch (error) {
            internalErrorCatcher(error);
        }
    }
    
    export function verifyJwtToken(token: string) {
        try {
            const verifed = jwt.verify(token, secretCode);
            return verifed;
        } catch (error: any) {
            if (error.expiredAt) {
                return {
                    status: 402,
                };
            }
        }
    }
    
}

export default JWT