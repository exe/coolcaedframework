const { Client } = require('../src');
const path = require('path');

const client = new Client({
    token: 'super-secret-token-here', // Token of the bot
    prefix: "!", // Prefix for bot commands
    selfbot: false, // Is the bot a selfbot or not
    ownerId: '199248578122612736', // Owner's id of the bot (can be empty if a selfbot)

    commandsPath: path.join(__dirname, 'commands'), // Path of the commands directory
    eventsPath: path.join(__dirname, 'events'), // Path of the events directory
    inhibitorsPath: path.join(__dirname, 'inhibitors') // Path of the events directory
});

client.login();