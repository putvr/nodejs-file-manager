import {createReadStream, createWriteStream} from "node:fs";
import zlib from 'node:zlib';
import path from "node:path";

const operation = (args, config, callback) => {
    if (!args[0] || !args[1]) throw 'Invalid input';

    return new Promise((resolve, reject) => {

        const oldPath = path.join(config.dir, args[0]);
        const newPath = path.join(config.dir, args[1]);

        const inputStream = createReadStream(oldPath);
        const outputStream = createWriteStream(newPath);

        inputStream.on('error', () => reject('Operation failed'));
        outputStream.on('error', () => reject('Operation failed'));

        const stream = inputStream.pipe(callback()).pipe(outputStream);

        stream.on('finish', () => resolve('compress'));
        stream.on('error', () => reject('Operation failed'));
    })
}

const compress = async (args, config) => operation(args, config, zlib.createBrotliCompress);
const decompress = async (args, config) => operation(args, config, zlib.createBrotliDecompress);

export default {compress, decompress};
