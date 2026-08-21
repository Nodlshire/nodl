const fs = require('fs');

const stateFile = '/home/obregan/wnode/state/engine.json';

if (!fs.existsSync(stateFile)) {
    console.log('State file not found.');
    process.exit(0);
}

const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));

let nodesRemoved = 0;
let identitiesRemoved = 0;

if (state.nodlrs) {
    for (const key of Object.keys(state.nodlrs)) {
        const id = state.nodlrs[key].id || state.nodlrs[key].ID || key;
        if (id.toLowerCase().includes('mock') || id.toLowerCase().includes('simulated')) {
            delete state.nodlrs[key];
            identitiesRemoved++;
        }
    }
}

if (state.nodes) {
    for (const key of Object.keys(state.nodes)) {
        const id = state.nodes[key].id || state.nodes[key].ID || key;
        if (id.toLowerCase().includes('mock') || id.toLowerCase().includes('simulated')) {
            delete state.nodes[key];
            nodesRemoved++;
        }
    }
}

fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));

console.log(`Cleaned state: Removed ${identitiesRemoved} mock identities and ${nodesRemoved} mock nodes.`);
