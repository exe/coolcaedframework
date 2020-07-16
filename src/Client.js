const { Client, Collection } = require('discord.js');
const Dispatcher = require('./Dispatcher');
const fs = require('fs');

module.exports = class EasyClient extends Client {
    constructor(options) {
        if (!options) throw new Error('Options must be passed into the client');

        if (!options.prefix) throw new Error('options.prefix must be passed into the client options');
        if (typeof options.prefix !== "string") throw new Error('options.prefix must be a string');

        if (!options.token) throw new Error('options.token must be passed into the client options');
        if (typeof options.token !== "string") throw new Error('options.token must be a string');

        if (!options.commandsPath) {
            if (typeof options.commandsPath !== "string") throw new Error('options.commandsPath must be a string');
            if (!fs.existsSync(options.commandsPath)) throw new Error('Command folder does not exist.')
        }

        if (options.ownerId) {
            if (typeof options.ownerId !== "string") throw new Error('options.ownerId must be a string');
        }

        if (options.selfbot) {
            if (typeof options.selfbot !== "boolean") throw new Error('options.selfbot must be a boolean');
        }

        if (options.eventsPath) {
            if (typeof options.eventsPath !== "string") throw new Error('options.eventsPath must be a string');
            if (!fs.existsSync(options.eventsPath)) throw new Error('Events folder does not exist.')
        }

        if (options.inhibitorsPath) {
            if (typeof options.inhibitorsPath !== "string") throw new Error('options.inhibitorsPath must be a string');
            if (!fs.existsSync(options.inhibitorsPath)) throw new Error('Inhibitors folder does not exist.')
        }

        if (options.selfbot) {
            options._tokenType = ""
        }

        super(options);

        this.prefix = options.prefix;
        this.token = options.token;
        this.owner = options.owner;
        this.selfbot = options.selfbot || false;
        this.ownerId = options.ownerId || null;
        this.commandsPath = options.commandsPath;
        this.eventsPath = options.eventsPath;
        this.inhibitorsPath = options.inhibitorsPath;

        this.dispatcher = new Dispatcher(this);

        this.commands = new Collection();
        this.aliases = new Collection();
        this.categories = new Collection();
        this.inhibitors = new Collection();

        this._loadCommands();
        this._loadEvents();
        this._loadInhibitor();

        this.once('ready', this._readyFixes.bind(this));
    }

    _readyFixes() {
        if (this.selfbot && !this.ownerId) this.ownerId = this.user.id;
    }

    login() {
        return super.login(this.token);
    }

    _loadCommands() {
        fs.readdir(this.commandsPath, (err, files) => {
            if (err) throw new Error(err);

            files.filter(f => fs.statSync(this.commandsPath + "/" + f).isDirectory())
                .forEach(folder => fs.readdirSync(this.commandsPath + "/" + folder).forEach(f => files.push(folder + "/" + f)))
            files = files.filter(f => f.endsWith('.js'));
            if (files.length <= 0) throw new Error('No commands to load');

            console.log(`[INIT] Loading ${files.length} commands.`);

            let aliasCache = [];

            for (let i = 0; i < files.length; i++) {
                const file = require(this.commandsPath + "/" + files[i]);
                const cmd = new file(this);

                if (!cmd.enabled) continue;

                const isCmdDupe = this.commands.find(cmdFind => cmdFind === cmd.name);
                if (isCmdDupe) throw new Error(`Command ${cmd.name} is already registed.`);

                this.commands.set(cmd.name, cmd);

                if (cmd.aliases) {
                    for (let i = 0; i < cmd.aliases.length; i++) {
                        const isDupe = aliasCache.includes(cmd.aliases[i]);
                        if (isDupe) throw new Error(`Alias ${cmd.aliases[i]} is already a registed alias.`);

                        aliasCache.push(cmd.aliases[i])
                    }
                }
            };
        });
    }

    _loadEvents() {
        fs.readdir(this.eventsPath, (err, files) => {
            if (err) throw new Error(err);

            files = files.filter(f => f.endsWith('.js'))
            if (files.length <= 0) return

            console.log(`[INIT] Loading ${files.length} events.`);

            for (let i = 0; i < files.length; i++) {
                const file = require(this.eventsPath + "/" + files[i]);
                const event = new file(this);

                if (!event.enabled) continue;

                if (event.once) {
                    this.once(event.event, (...args) => event.run(...args));
                } else {
                    this.on(event.event, (...args) => event.run(...args));
                }
            };
        });
    }

    _loadInhibitor() {
        fs.readdir(this.inhibitorsPath, (err, files) => {
            if (err) throw new Error(err);

            files = files.filter(f => f.endsWith('.js'))
            if (files.length <= 0) return;

            console.log(`[INIT] Loading ${files.length} inhibitors.`);

            for (let i = 0; i < files.length; i++) {
                const file = require(this.inhibitorsPath + "/" + files[i]);
                const inhibitor = new file(this);

                if (!inhibitor.enabled) continue;

                const name = inhibitor.name ? inhibitor.name : files[i].split(".")[0];

                this.inhibitors.set(name, inhibitor);
            };
        });
    }
}