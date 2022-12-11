import * as nodeos from 'node:os';

const os = async (args, _) => {
    if (!args[0]) return 'Invalid input';

    switch (args[0]) {
        case "--EOL":
            console.log(JSON.stringify(nodeos.EOL));
            return `EOL`;
        case '--cpus':
            const cpus = nodeos.cpus()
            console.log(`${cpus.length} CPUs`);
            for (let cpu of cpus) {
                console.log(`${cpu.model} - ${cpu.speed}Hz`);
            }
            return 'cpus';
        case '--homedir':
            console.log(nodeos.homedir())
            return `homedir`;
        case '--username':
            console.log(nodeos.userInfo().username)
            return 'username';
        case '--architecture':
            console.log(nodeos.arch());
            return 'architecture';
        default:
            return 'os';
    }
}

export {os};
