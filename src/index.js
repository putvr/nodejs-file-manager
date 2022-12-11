import {parse, execute, exit} from "./utils.mjs";
import {init} from './init.mjs';
import fs from './fs.mjs';
import * as os from './os.mjs' ;
import hash from "./hash.mjs";

const DEBUG = false; // TODO: !!!!

const commands = {...fs, ...os, ...hash};
const config = {...init(process.argv), commands};

process.stdin.on('data', async (chunk) => {
    const data = await parse(chunk);

    execute(data, config)
        .then((res) => {
            if (DEBUG) process.stdout.write(`DEBUG :${String(res)}\n`);
            process.stdout.write(`${config.dir} ${config.prompt}`);
        }).catch((err) => {
            process.stdout.write(`${err}\n${config.dir} ${config.prompt}`)
        }
    )
});

process.on('SIGINT', () => {
    exit(config.username);
    process.exit();
});
