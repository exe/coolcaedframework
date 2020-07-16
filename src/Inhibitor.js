module.exports = class Inhibitor {
    constructor(client, options) {
        this._validateOptions(options);
        
        this.client = client;
        this.enabled = options.enabled || true;
        this.name = options.name;
    }

    run(msg, cmd) {
        throw new Error(`Inhibitor ${this.name} does not have a run function`);
    }

    _validateOptions(options) {
        if (!options) throw new Error('Options must be passed into the inhibitor');
        if (typeof options !== "object") throw new Error('options must be a object');

        if (options.enabled) {
            if (typeof options.enabled !== "boolean") throw new Error('options.enabled must be a boolean');
        }
    }
}