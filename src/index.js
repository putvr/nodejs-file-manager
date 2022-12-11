import {Transform} from 'node:stream';
import {init, parse, execute, exit} from "./utils.mjs";

const config = {
    username: '123',
    dir: '123',
    prompt: 'PROMPT: > '
}

init(config);

const myTransform = new Transform({
    transform(chunk, encoding, callback) {

        console.log(config.prompt);

        const data = parse(chunk);

        const result = execute(data);

        callback(null, `chunk: ${result}`);
    },
});
// main loop
process.stdin.pipe(myTransform).pipe(process.stdout);

process.on('SIGINT', () => {
    exit(config.username);
    process.exit();
});
