require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, Collection } = require ('discord.js');
const mongoose = require('mongoose');

const logger = require('./logger');


const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES],
})

const commands = [];

client.commands = new Collection();
client.tools = require('./tools/bad.js');

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		logger.error(`The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.once('ready', () => {
    logger.info("POTATO is Online");

    const CLIENT_ID = client.user.id;

    const rest = new REST({
        version: '9'
    }).setToken(process.env.TOKEN);

    (async () => {
        try {
            if(process.env.ENV === 'Production') {
                await rest.put(Routes.applicationCommands(CLIENT_ID), {
                    body: commands
                });
                logger.info('Successfully registered commands globally.')
            } else {
                await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID), {
                    body: commands
                });
                logger.info('Successfully registered commands locally.');
            }
        } catch (err) {
            if (err) logger.error(err);
        }
    })()
});

client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if(!command) return;

    try {
        await command.execute(interaction);
    } catch(err) {
        if (err) logger.error(err);

        await interaction.reply({
            content: 'An error occured while executing that command',
            ephemeral: true,
        })
    }
});

client.login(process.env.TOKEN)
