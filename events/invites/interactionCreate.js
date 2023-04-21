
const client = require("../../index");
const inviteSchema = require("../../utils/schemas/userInvites");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.customId == "refreshTop") {
        const lang = await client.getLang(interaction.guild.id)
        let data = await inviteSchema.find({guildId : interaction.guild.id}).sort({invites : -1}).limit(10)
        let embed = new EmbedBuilder()
        .setTitle((await client.translator("Voici le top 10 ", {to : lang})).text)
        .setFields(data.map((d, i) => {
            return {
                name : `${i + 1} - ${client.users.cache.get(d.userId).tag}`,
                value : `${d.invites} invites`
            }
        }))
        .setTimestamp()
        .setColor(client.config.defaultColor)
        interaction.update({embeds : [embed]})

    }
});