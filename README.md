A [discord.js](https://discord.js.org/#/) framework, making it easy to create commands and events, saving you the time of having to make a handler. You can view the example code [here](https://github.com/exe/coolcaedFramework/tree/master/example)

> Yes the code of this is very messy it was kinda rushed

Install the framework by doing `npm install --save coolcaedframework`

### Creating the client
Name | Type | Required | Description
------------ | ------------- | ------------ | ------------
prefix | String | `true` | The prefix used at the start of commands
token | String | `true` | The bots/users token of the account used to authenticate
ownerId | String | `false` | The ID of the bots owner (not required if a selfbot)
selfbot | Boolean | `false` | Is the bot a selfbot or normal bot
eventsPath | String | `true` | The directory path for the event files
inhibitorsPath | String | `true` | The directory path for the inhibitor files
commandsPath | String | `true` | The directory path for the command files

```js
const { Client } = require('coolcaedframework');
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
```

### Creating an command
These commands will be executed by the prefix set on Client.prefix followed by the command name or one of the aliases

Name | Type | Required | Description
------------ | ------------- | ------------ | ------------
name | String | `true` | Name of the command
description | String | `false` | Description of the command (what it does etc)
aliases | Array<String> | `false` | Command aliases (other triggers of the command)
guildOnly | Bolean | `false` | Should the command only be allowed in guilds only?
category | String | `false` | The category the command is in
cooldown | Integer | `false` | Time a user should wait before doing the command again (in seconds)
inhibitors | Array<String> | `false` | Inhibitors that should be ran before calling the commands run function

```js
const { Command } = require('coolcaedframework');

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
```

### Creating an event
The code will be triggered when ever an event is emitted by discord.js

Name | Type | Required | Description
------------ | ------------- | ------------ | ------------
event | String | `true` | Name of the event
once | Boolean | `false` | Should the event be ran once

```js
const { Event } = require('coolcaedframework');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            event: 'ready',
            once: true
        });
    }

    run() {
        console.log(`Logged in as ${this.client.user.tag}`);
    }
}
```

### Creating an inhibitor
These are ran before the commands run function gets called, the name of the inhibitor should be passed into the Command.inhibitors array

name | Type | Required | Description
------------ | ------------- | ------------ | ------------
name | String | `true` | Name of the inhibitor

```js
const { Inhibitor } = require('coolcaedframework');

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
```

If you find any bugs or errors in this code, please contact me on discord: Caed#0024
