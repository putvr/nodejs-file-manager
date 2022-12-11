import {createReadStream, createWriteStream} from "node:fs";
import zlib from 'node:zlib';
import path from "node:path";

const compress = async (args, config) => {
    if (!args[0] || !args[1]) throw 'Invalid input';

    return new Promise((resolve, reject) => {

        const oldPath = config.dir + path.sep + args[0];
        const newPath = config.dir + path.sep + args[1];

        const inputStream = createReadStream(oldPath);
        const outputStream = createWriteStream(newPath);

        inputStream.on('error', () => reject('Operation failed'));
        outputStream.on('error', () => reject('Operation failed'));

        const brotli = zlib.createBrotliCompress();

        const stream = inputStream.pipe(brotli).pipe(outputStream);

        stream.on('finish', () => resolve('compress'));
        stream.on('error', () => reject('Operation failed'));
    })
}
const decompress = async (args, config) => {
    if (!args[0] || !args[1]) throw 'Invalid input';

    return new Promise((resolve, reject) => {

        const oldPath = config.dir + path.sep + args[0];
        const newPath = config.dir + path.sep + args[1];

        const inputStream = createReadStream(oldPath);
        const outputStream = createWriteStream(newPath);

        inputStream.on('error', () => reject('Operation failed'));
        outputStream.on('error', () => reject('Operation failed'));

        const brotli = zlib.createBrotliDecompress();

        const stream = inputStream.pipe(brotli).pipe(outputStream);

        stream.on('finish', () => resolve('decompress'));
        stream.on('error', () => reject('Operation failed'));
    })
}


export default {compress, decompress};
