class Event {
    constructor(client, options) {
        this._validateOptions(options);

        this.client = client;
        this.event = options.event;
        this.once = options.once || false;
        this.enabled = options.enabled || true;
    }

    run() {
        throw new Error(`Event ${this.event} does not have a run function`);
    }

    _validateOptions(options) {
        if (!options) throw new Error('Options must be passed into the event');
        if (typeof options !== "object") throw new Error('options must be a object');

        if (!options.event) throw new Error('options.event must be passed into the event');
        if (typeof options.event !== "string") throw new Error('options.event must be a string');

        if (options.enabled) {
            if (typeof options.enabled !== "boolean") throw new Error('options.enabled must be a boolean');
        }

        if (options.once) {
            if (typeof options.enabled !== "boolean") throw new Error('options.once must be a boolean');
        }
    }
}

module.exports = Event;