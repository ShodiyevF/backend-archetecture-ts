import jwt from 'jsonwebtoken'

import internalErrorCatcher from '@shared/logger/logger.internal';
import EnvLib from './env.lib';

namespace JWT {

    const expiration = +EnvLib.getVariable('JWT_EXPIRATION')
    const secretCode = EnvLib.getVariable('JWT_SECRET')
    
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