const { Client, GatewayIntentBits, EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { token, apitoken, approvedguildid, apiurl, country } = require("./config.json");

const { issuePassportCommand } = require("./commands/issuepassport");
const { invalidatePassportCommand } = require("./commands/invalidatepassport");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (!approvedguildid.includes(interaction.guildId)) {
        await interaction.reply(`This server has not been approved by ${country} government to use this admin bot. If you are a ${country} representative, and want to use the admin bot in this server, please reach out to INTERPOL eServices support.`);
        return;
    }

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }

    if (interaction.commandName === 'issuepassport') {
        await interaction.deferReply();
        await issuePassportCommand(interaction);
    }

    if (interaction.commandName === 'invalidatepassport') {
        await interaction.deferReply();
        await invalidatePassportCommand(interaction);
    }
});

client.login(token);