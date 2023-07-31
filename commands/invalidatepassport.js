const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { apiFetch, postFlags } = require('../util');

async function invalidatePassportCommand(interaction, apitoken) {
    let id = interaction.options.getNumber('id');
    let userid = interaction.user.id;

    apiFetch('/v1/passport/' + id, undefined, (res) => {
        const buttonId = `invalide ${id} ${Math.floor(Math.random() * 1000000)}`;

        interaction.editReply({
            content: `Are you really sure you want to invalidate ${res.username}'s passport with ID ${id}?`,
            components: [new ActionRowBuilder().addComponents(new ButtonBuilder()
                            .setCustomId(buttonId)
                            .setLabel('Invalidate')
                            .setStyle(ButtonStyle.Danger))]
        });

        const filter = i => i.customId.startsWith(buttonId) && i.user.id === userid;
        const collector = interaction.channel.createMessageComponentCollector({filter, time: 15000});

        collector.on('collect', async i => {
            await i.deferUpdate();

            apiFetch('/v1/passport/invalidate', postFlags({
                "id": id
            }, apitoken), (res) => {}, (res) => {
                i.editReply({content: res, components: []});
            });
        });
    }, (res) => {
        interaction.editReply({content: res})
    });
}

module.exports = {
    invalidatePassportCommand
}
