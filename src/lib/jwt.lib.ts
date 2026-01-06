import jwt from 'jsonwebtoken'
import fs from 'fs';

import internalErrorCatcher from '@shared/logger/logger.internal';
import FS from '@config/fs.config';
import EnvLib from './env.lib';

namespace JwtLib {

    export interface IJwtSuccessReturn<T> {
        result: 'SUCCESS';
        data?: T;
    }

    export interface IJwtErrorReturn {
        result: 'UNVERIFIED' | 'EXPIRED' | 'ERROR';
        message?: string;
    }

    export type TJwtReturn<T> = IJwtSuccessReturn<T> | IJwtErrorReturn

    const PRIVATE_KEY = fs.readFileSync(FS.StaticPaths.accessPrivateKey, 'utf8');
    const PUBLIC_KEY = fs.readFileSync(FS.StaticPaths.accessPublicKey, 'utf8');

    const expiration = +EnvLib.getVariable('JWT_EXPIRATION')
    
    export function generateToken(payload: object): TJwtReturn<string> {
        try {
            const token = jwt.sign(payload, PRIVATE_KEY, {
                expiresIn: expiration,
                algorithm: 'RS256'
            });

            return {
                result: 'SUCCESS',
                data: token
            };
        } catch (error: any) {
            internalErrorCatcher(error);

            return {
                result: 'ERROR',
                message: error.message ? error.message : error.name
            }
        }
    }
    
    export function verifyToken<T extends jwt.JwtPayload>(token: string): TJwtReturn<T> {
        try {
            const verifed = jwt.verify(token, PUBLIC_KEY, {
                algorithms: ['RS256']
            });
            
            return {
                result: 'SUCCESS',
                data: verifed as T
            };
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                return {
                    result: 'EXPIRED',
                    message: 'Token expired'
                }
            }
            
            return {
                result: 'ERROR',
                message: error.message ? error.message : error.name
            }
        }
    }
    
}

export default JwtLib