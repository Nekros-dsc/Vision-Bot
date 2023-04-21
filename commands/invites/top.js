
let inviteSchema = require("../../utils/schemas/userInvites") 
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js")
module.exports = {
    name : "top",
    aliases : ["topinvites", "topinv"],
    run : async  (client, message, args) =>{
        const lang = await client.getLang(message.guild.id)
        let data = await inviteSchema.find({guildId : message.guild.id}).sort({invites : -1}).limit(10)
        let embed = new EmbedBuilder()
        .setTitle((await client.translator("Voici le top 10  ", {to : lang})).text)
        .setFields(data.map((d, i) => {
            return {
                name : `${i + 1} - ${client.users.cache.get(d.userId).tag}`,
                value : `${d.invites} invites`
            }
        }))
        .setTimestamp()
        .setColor(client.config.defaultColor)

        let buttonRefresh = new ButtonBuilder()
        .setCustomId("refreshTop")
        .setStyle("Primary")
        .setEmoji({
            name : client.emoji.time.split(":")[1].replace(">", ""),
            id : client.emoji.time.split(":")[2].replace(">", "")
        })
        let row = new ActionRowBuilder()
        .addComponents(buttonRefresh)



        message.channel.send({embeds : [embed], components : [row]})


}
}