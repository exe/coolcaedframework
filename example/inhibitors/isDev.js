const { Inhibitor } = require('../../src');

module.exports = class extends Inhibitor {
    constructor(...args) {
        super(...args, {
            enabled: true,
            name: 'isDev'
        });
    }

    run(msg, cmd) {
        if (!msg.author.id === this.client.ownerId) throw "You're not a developer";
    }
}