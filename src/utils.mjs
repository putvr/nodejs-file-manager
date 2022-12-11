export const parse = async (str) => {
    return String(str).split(' ').map(e => e.trim());
}

export const execute = async ([cmd, ...args], config) => {
    const cmdExecutor = config.commands[cmd];
    //console.log(config, cmd, cmdExecutor);
    if (!cmdExecutor) {
        return ('Invalid input');
    }

    return await cmdExecutor(args, config);
}

export const exit = (username) => {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
}
