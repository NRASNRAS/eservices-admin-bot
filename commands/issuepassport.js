const { EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { apiFetch, postFlags } = require('../util');

async function issuePassportCommand(interaction) {
    let user = interaction.options.getUser("person");
    let ign = interaction.options.getString('ign');
    let place = interaction.options.getString('place');

    const buttonId = `create ${ign} ${Math.floor(Math.random() * 1000000)}`;

    if (user) {
        interaction.editReply({
            content: `Do you want to issue a passport to ${ign} with discord <@${user.id}> located in ${place}?`,
            components: [new ActionRowBuilder().addComponents(new ButtonBuilder()
                .setCustomId(buttonId)
                .setLabel('Issue')
                .setStyle(ButtonStyle.Success))]
        });
    } else {
        interaction.editReply({
            content: `Do you want to issue a passport to ${ign} with **NO** discord located in ${place}?`,
            components: [new ActionRowBuilder().addComponents(new ButtonBuilder()
                .setCustomId(buttonId)
                .setLabel('Issue')
                .setStyle(ButtonStyle.Success))]
        });
    }

    const filter = i => i.customId.startsWith(buttonId) && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({filter, time: 30000});

    collector.on('collect', async i => {
        await i.deferUpdate();

        apiFetch('/v1/passport/create', postFlags({
            "username": ign,
            "discord": user ? user.id : "",
            "issuedby": interaction.user.id,
            "place": place
        }), (res) => {
            let embed = new EmbedBuilder()
                .setTitle("Passport Issued: " + res.type)
                .setColor(res.type === "success" ? Colors.Green : Colors.Red)
                .addFields(
                    {name: "ID", value: res.id+""},
                    {name: "Name", value: ign},
                    {name: "Discord", value: user ? `<@${user.id}>` : "None"},
                    {name: "Issued by", value: `<@${interaction.user.id}>`},
                    {name: "Place", value: place}
                )
            i.editReply({embeds: [embed], content: "", components: []});
        }, (res) => {
            i.editReply({content: res, components: []});
        });
    });
}

module.exports = {
    issuePassportCommand
}