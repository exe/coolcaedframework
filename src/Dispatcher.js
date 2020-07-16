module.exports = class Dispatcher {
    constructor(client) {
        this.client = client;

        this.client.on('message', this.handleMessage.bind(this));
    }

    async handleMessage(msg) {
        if (!this._validateMessage(msg)) return;
        let command = msg.content.split(" ")[0];
        command = command.slice(this.client.prefix.length).toLowerCase();
        let args = msg.content.split(" ").slice(this.client.prefix.length);

        command = this._getCommand(command);
        if (!command) return;

        if (command.inhibitors && command.inhibitors.length > 0) {
            const cmdInhibitors = command.inhibitors;

            for (let i = 0; i < cmdInhibitors.length; i++) {
                const inhibitorsToRun = cmdInhibitors[i];
                const inhibitor = this.client.inhibitors.get(inhibitorsToRun);

                try {
                    const response = await inhibitor.run(msg, command);
                    if (response) return msg.channel.send(response);
                } catch (error) {
                    return msg.channel.send(error);
                }
            }
        }

        if (command.guildOnly && !msg.guild) return;

        if (!this.client.selfbot && msg.author.id !== this.client.ownerId) {
            let cooldown = command.cooldowns.get(msg.author.id);
            if (cooldown) return msg.channel.send(`You are on a cooldown for another \`${((cooldown.start + command.cooldown - Date.now()) / 1000).toFixed(1)} seconds\``)

            command._cooldownUser(msg.author.id);
        }

        if (this.client.selfbot) msg.delete();

        command.run(msg, args);
    }

    _validateMessage(msg) {
        if (this.client.selfbot && msg.author.id !== this.client.ownerId) return;
        if (msg.author.bot) return false;
        if (!msg.content) return false;
        if (!msg.content.startsWith(this.client.prefix)) return false;

        return true;
    }

    _getCommand(command) {
        let commandArray = this.client.commands.find(cmd => cmd.name === command || cmd.aliases.includes(command));

        if (commandArray) return commandArray
        return null;
    }
}