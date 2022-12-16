const { token, clientid } = require("./config.json");
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Ping pong!'),
    new SlashCommandBuilder().setName('issuepassport').setDescription('Issue a new passport')
        .setDefaultMemberPermissions(8)
        .addUserOption(option => option.setName("person").setDescription("Discord of the person you're issuing this passport to").setRequired(true))
        .addStringOption(option => option.setName("ign").setDescription("Minecraft nickname of the person you're issuing this document to").setRequired(true)),
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(clientid), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();