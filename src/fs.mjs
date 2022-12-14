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
    if (!newPath) throw('Invalid input');

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
            let table = [];

            files.forEach(file => {
                table.push({
                    Name: file.name,
                    Type: (file.isDirectory() ? 'directory' : 'file')
                });
            });
            table.sort((a, b) => (a.Type).localeCompare(b.Type));
            console.table(table);
            return 'ls!';
        }).catch(() => 'Operation failed')
}
const cat = (args, config) => {
    if (!args[0]) throw('Invalid input');

    return new Promise((resolve, reject) => {
        let data = '';

        const stream = createReadStream(path.join(config.dir, args[0]));

        stream.on('data', (buff) => {
            data += buff;
        })

        stream.on('end', () => {
            console.log(data);
            return resolve(data);
        });

        stream.on('error', () => {
            return reject('Operation failed');
        })
    })
}

const add = async (args, config) => {
    if (!args[0]) throw('Invalid input');

    const filename = path.join(config.dir, args[0]);

    return await fs.open(filename, 'a')
        .then(async (handle) => {
            await handle.close();
            return `${filename} created`;
        })
        .catch(() => 'Operation failed')
}

const rn = async (args, config) => {
    if (!args[0] || !args[1]) throw('Invalid input');

    const oldPath = path.join(config.dir, args[0]);
    const newPath = path.join(config.dir, args[1]);

    return fs.rename(oldPath, newPath).then(() => '').catch(() => 'Operation failed');
}

const cp = async (args, config) => {
    if (!args[0] || !args[1]) throw('Invalid input');

    return new Promise((resolve, reject) => {
        const oldPath = path.join(config.dir, args[0]);
        const newPath = path.join(config.dir, args[1]);

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
            await fs.unlink(path.join(config.dir, args[0]));
            resolve('mv!');
        })
        .catch((err) => reject(err))
});

const rm = async (args, config) => {
    if (!args[0]) throw('Invalid input');

    const fileName = path.join(config.dir, args[0]);

    return fs.unlink(fileName).then(() => 'Delete!').catch(() => 'Operation failed');
}

export default {up, cd, ls, cat, add, rn, cp, mv, rm}
