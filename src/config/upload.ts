import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
    tmpFolder,
    uploadsFolder: path.resolve(tmpFolder, 'uploads'),
    storage: multer.diskStorage({
        destination: tmpFolder,
        filename(req, file, callback) {
            const filehash = crypto.randomBytes(10).toString('HEX');
            const filename = `${filehash}-${file.originalname}`;

            return callback(null, filename);
        },
    }),
};
