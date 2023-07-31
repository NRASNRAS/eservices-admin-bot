const { Client, GatewayIntentBits } = require('discord.js');
const { token, nations } = require("./config.json");

const { issuePassportCommand } = require("./commands/issuepassport");
const { invalidatePassportCommand } = require("./commands/invalidatepassport");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (!nations[interaction.guildId]) {
        await interaction.reply(`This server is not registered to any nation. Please contact INTERPOL eServices support.`);
        return;
    }
    let nationName = nations[interaction.guildId][0];
    let apiToken = nations[interaction.guildId][1];

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong' + nationName);
    }

    if (interaction.commandName === 'issuepassport') {
        await interaction.deferReply();
        await issuePassportCommand(interaction, apiToken);
    }

    if (interaction.commandName === 'invalidatepassport') {
        await interaction.deferReply();
        await invalidatePassportCommand(interaction, apiToken);
    }
});

client.login(token);
