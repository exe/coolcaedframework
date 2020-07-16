const { Event } = require('../../src/index');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            event: 'ready',
            enabled: true,
            once: true
        });
    }

    run() {
        console.log(`logged in as ${this.client.user.tag}`);
    }
}