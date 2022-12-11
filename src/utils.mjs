
export const init = (config) => {
    console.log(`Welcome to the File Manager, Username!`);
    console.log(`You are currently in ${config.dir}`);
    console.log(config.prompt);
}

export const parse = (string) =>{
    return {}
}

export const execute = (data) => {
    return '123'
}

export const exit = (username) => {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
}
