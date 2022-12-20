export const parse = async (str) => {
    return String(str).split(' ').map(e => e.trim());
}

export const execute = async ([cmd, ...args], config) => {
    if (cmd === '.exit') process.emit('SIGINT');

    const cmdExecutor = config.commands[cmd];

    if (!cmdExecutor) {
        console.log('Invalid input');
        return;
    }

    return await cmdExecutor(args, config);
}

export const exit = (username) => {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
}
