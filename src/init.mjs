import {homedir} from 'node:os';

export const init = (argv) => {
    let username = argv.reduce((acc, elem) => {
        if (elem.startsWith('--username')) {
            return elem.split('=')[1];
        }
        return acc;
    }, '');

    //username = username || 'User'; //TODO: remove at prod

    const dir = homedir();
    const prompt = ' > ';

    console.log(`Welcome to the File Manager, ${username}!`);
    console.log(`You are currently in ${dir}`);
    process.stdout.write(`${dir} ${prompt}`);

    return {
        username,
        dir,
        prompt
    }
}
