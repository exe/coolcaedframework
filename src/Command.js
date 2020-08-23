class Command {
    constructor(client, options) {
        this._validateOptions(options);

        this.client = client;
        this.enabled = options.enabled || true;
        this.name = options.name;
        this.description = options.description || "Description not set.";
        this.aliases = options.aliases || [];
        this.guildOnly = options.guildOnly || false;
        this.category = options.category || null;
        this.cooldown = options.cooldown * 1000 || -1;
        this.inhibitors = options.inhibitors || [];

        this.cooldowns = new Map();
    }

    run(msg, args) {
        throw new Error(`Command ${this.name} does not have a run function`);
    }

    _cooldownUser(id) {
        if (this.cooldown < 1) return null;

        let cooldown = this.cooldowns.get(id);
        if (cooldown) return cooldown;

        this.cooldowns.set(id, {
            start: Date.now(),
            timeout: setTimeout(() => this.cooldowns.delete(id), this.cooldown)
        });
    }

    _validateOptions(options) {
        if (!options) throw new Error('Options must be passed into the command');
        if (typeof options !== "object") throw new Error('options must be a object');

        if (options.enabled) {
            if (typeof options.enabled !== "boolean") throw new Error('options.enabled must be a boolean');
        }

        if (!options.name) throw new Error('options.name must be passed into the command');
        if (typeof options.name !== "string") throw new Error('options.name must be a string');

        if (options.description) {
            if (typeof options.description !== "string") throw new Error('options.description must be a string');
        }

        if (options.guildOnly) {
            if (typeof options.guildOnly !== "boolean") throw new Error('options.guildOnly must be a boolean');
        }

        if (options.category) {
            if (typeof options.category !== "string") throw new Error('options.category must be a string');
        }

        if (options.aliases) {
            if (!Array.isArray(options.aliases)) throw new Error('options.aliases must be an array');

            for (let i = 0; i < options.aliases.length; i++) {
                if (typeof options.aliases[i] !== 'string') throw new Error(`options.aliases[${i + 1}] must be a string`);
            }
        }

        if (options.inhibitors) {
            if (!Array.isArray(options.inhibitors)) throw new Error('options.inhibitors must be an array');

            for (let i = 0; i < options.inhibitors.length; i++) {
                if (typeof options.inhibitors[i] !== 'string') throw new Error(`options.inhibitors[${i + 1}] must be a string`);
            }
        }

        if (options.cooldown) {
            if (typeof options.cooldown !== 'number') throw new Error('options.cooldown must be a number');
        }
    }
}

module.exports = Command;