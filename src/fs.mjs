import fs from 'node:fs/promises';
import path from 'node:path';
import {createReadStream, createWriteStream} from 'node:fs';

const up = (_, config) => {
    const dir = config.dir.split(path.sep);
    if (dir.length === 1) return 'Root!';

    dir.pop();
    const upDir = dir.join(path.sep);

    config.dir = upDir;
    return `${upDir}`;
}

const cd = ([newPath, _], config) => {
    if (!newPath) return 'Invalid input';

    newPath = path.join(config.dir, newPath)

    return fs.access(newPath, fs.F_OK)
        .then(() => {
            config.dir = newPath;
            return `New path ${config.dir}`;
        })
        .catch(() => 'Operation failed')
}

const ls = (_, config) => {
    return fs.readdir(config.dir, {withFileTypes: true})
        .then((files) => {
            const table = [];
            files.forEach(file => {
                table.push({
                    Name: file.name,
                    Type: (file.isDirectory() ? 'directory' : 'file')
                });
            });
            console.table(table);
            return 'ls!';
        }).catch(() => 'Operation failed')
}
const cat = (args, config) => {
    if (!args[0]) return 'Invalid input';

    return new Promise((resolve, reject) => {
        let data = '';

        const stream = createReadStream(config.dir + path.sep + args[0]);

        stream.on('data', (buff) => {
            data += buff;
        })

        stream.on('end', () => {
            return resolve(data);
        });

        stream.on('error', () => {
            return reject('Operation failed');
        })
    })
}

const add = async (args, config) => {
    if (!args[0]) return 'Invalid input';

    const filename = config.dir + path.sep + args[0];

    return await fs.open(filename, 'a')
        .then(async (handle) => {
            await handle.close();
            return `${filename} created`;
        })
        .catch(() => 'Operation failed')
}

const rn = async (args, config) => {
    if (!args[0] || !args[1]) return 'Invalid input';

    const oldPath = config.dir + path.sep + args[0];
    const newPath = config.dir + path.sep + args[1];

    return fs.rename(oldPath, newPath).then(() => '').catch(() => 'Operation failed');
}

const cp = async (args, config) => {
    if (!args[0] || !args[1]) return 'Invalid input';

    return new Promise((resolve, reject) => {
        const oldPath = config.dir + path.sep + args[0];
        const newPath = config.dir + path.sep + args[1];

        const inputStream = createReadStream(oldPath);
        const outputStream = createWriteStream(newPath);

        inputStream.on('data', (data) => {
            outputStream.write(data);
        })

        inputStream.on('end', () => {
            outputStream.close(() => {
                resolve('!')
            });
        })

        inputStream.on('error', () => reject('Operation failed'));
    });
}

const mv = async (args, config) => new Promise(async (resolve, reject) => {
    await cp(args, config)
        .then(async () => {
            await fs.unlink(config.dir + path.sep + args[0]);
            resolve('mv!');
        })
        .catch((err) => reject(err))
});

const rm = async (args, config) => {
    if (!args[0]) return 'Invalid input';

    const fileName = config.dir + path.sep + args[0];

    return fs.unlink(fileName).then(() => 'Delete!').catch(() => 'Operation failed');
}

export default {up, cd, ls, cat, add, rn, cp, mv, rm}
