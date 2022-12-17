const { Client, GatewayIntentBits, EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { token, apitoken, approvedguildid, apiurl } = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

function postFlags(flags) {
    return {
        method: "post",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "token": apitoken,
            ...flags
        })
    }
}

function apiFetch(url, flags, callback, callbackString) {
    fetch(url, flags)
    .then((res) => res.text())
    .then((res) => {
        if (res.startsWith("{") || res.startsWith("[")) {
            return JSON.parse(res);
        }
        return res;
    })
    .then((res) => {
        if (typeof res === "string") {
            callbackString(res);
        } else {
            callback(res);
        }
    })
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.guildId !== approvedguildid) {
        return;
    }

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }

    if (interaction.commandName === 'issuepassport') {
        let user = interaction.options.getUser("person");
        let ign = interaction.options.getString('ign');

        apiFetch(apiurl + '/v1/passport/create', postFlags({
            "username": ign,
            "discord": user.id,
            "issuedby": interaction.user.id
        }), (res) => {
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
        }, (res) => interaction.reply({content: res}));
    }

    if (interaction.commandName === 'invalidatepassport') {
        let id = interaction.options.getNumber('id');
        let userid = interaction.user.id;
        apiFetch(apiurl + '/v1/passport/' + id, undefined, (res) => {
            const buttonId = `invalide ${id}`;

            interaction.reply({
                content: `Are you really sure you want to invalidate ${res.username}'s passport with ID ${id}?`,
                components: [new ActionRowBuilder().addComponents(new ButtonBuilder()
                                .setCustomId(buttonId)
                                .setLabel('Invalidate')
                                .setStyle(ButtonStyle.Danger))]
            });

            const filter = i => i.customId.startsWith(buttonId) && i.user.id === userid;
            const collector = interaction.channel.createMessageComponentCollector({filter, time: 15000});

            collector.on('collect', async i => {
                apiFetch(apiurl + '/v1/passport/invalidate', postFlags({
                    "id": id
                }), (res) => {}, (res) => {
                    i.update({content: res, components: []});
                });
            });
        }, (res) => interaction.reply({content: res}));
    }
});

client.login(token);