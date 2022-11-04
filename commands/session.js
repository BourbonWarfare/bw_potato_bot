const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('session')
    .setDescription('Get details regarding next session and other session time references'),
    async execute(interaction) {
        interaction.reply({
            content: 'session stuff',
            ephemeral: false
        });
    }
}
