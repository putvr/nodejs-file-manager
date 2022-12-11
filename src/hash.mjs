import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import path from "node:path";

const hash = async ([file, _], config) => {
    if (!file) throw ('Invalid input');

    const filePath = path.join(config.dir, file);

    return readFile(filePath)
        .then(data => {
            const hex = createHash('sha256').update(data).digest('hex');
            console.log(hex);
        })
        .catch(() => {
            console.log('Operation failed');
        })
}
export default {hash};
