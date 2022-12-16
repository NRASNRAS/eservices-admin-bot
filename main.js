const { Client, GatewayIntentBits, EmbedBuilder, Colors } = require('discord.js');
const { token, apitoken } = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }

  if (interaction.commandName === 'issuepassport') {
    let user = interaction.options.getUser("person");
    let ign = interaction.options.getString('ign');

    fetch('https://nras.dqu.one/v1/passport/create', {
        method: "post",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "token": apitoken,
            "username": ign,
            "discord": user.id,
            "issuedby": interaction.user.id
        })
    })
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return res.text();
            }
        })
        .then((res) => {
            if (typeof res === "string") {
                interaction.reply({content: res});
                return;
            } else {
                let embed = new EmbedBuilder()
                    .setTitle("Passport Issued: " + res.type)
                    .setColor(res.type === "success" ? Colors.Green : Colors.Red)
                    .addFields(
                        {name: "ID", value: res.id+""},
                        {name: "Name", value: ign},
                        {name: "Discord", value: `<@${user.id}>`},
                        {name: "Issued by", value: `<@${interaction.user.id}>`}
                    )
                interaction.reply({embeds: [embed]})
            }
        })
  }
});

client.login(token);