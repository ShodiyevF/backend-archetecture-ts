import childProcess from 'child_process'
import path from 'path'
import fs from 'fs'

namespace FS {
    export namespace StaticPaths {
        export const uploadsFolder = path.join(process.cwd(), 'upload')

        export const keyFolder = path.join(process.cwd(), 'src', 'key')

        export const accessPrivateKey = path.join(keyFolder, 'access.private.key')

        export const accessPublicKey = path.join(keyFolder, 'access.public.key')
    }
    
    export function initDefaultFolders() {
        const UPLOAD_FOLDER = fs.existsSync(StaticPaths.uploadsFolder);
        if (!UPLOAD_FOLDER) {
            fs.mkdirSync(StaticPaths.uploadsFolder);
        }

        const KEY_FOLDER = fs.existsSync(StaticPaths.keyFolder);
        if (!KEY_FOLDER) {
            fs.mkdirSync(StaticPaths.keyFolder);
        }
    }
    
    export function initDefaultFiles() {
        const privateKeyPath = path.join(StaticPaths.accessPrivateKey)
        const publicKeyPath = path.join(StaticPaths.accessPublicKey)
        
        const PRIVATE_KEY = fs.existsSync(privateKeyPath);
        if (!PRIVATE_KEY) {
            childProcess.execSync(`openssl genrsa -out ${privateKeyPath} 4096`, {
                stdio: 'ignore'
            })
        }

        const PUBLIC_KEY = fs.existsSync(publicKeyPath);
        if (!PUBLIC_KEY) {
            childProcess.execSync(`openssl rsa -in ${privateKeyPath} -pubout -out ${publicKeyPath}`, {
                stdio: 'ignore'
            })
        }
    }

    export function runner() {
        initDefaultFolders()
        initDefaultFiles()
    }
}

export default FS