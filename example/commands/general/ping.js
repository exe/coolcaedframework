const { Command } = require('../../../src');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            enabled: true,
            name: 'ping',
            description: 'Ping pong',
            category: 'General',
            guildOnly: true,
            cooldown: 3,
            aliases: ['pong'],
            inhibitors: ["isDev"]
        });
    }

    run(msg, args) {
        msg.channel.send('Pong');
    }
}