const { UserSelectMenuBuilder } = require("@discordjs/builders")
const { ButtonBuilder, ActionRowBuilder } = require("discord.js")
const langSchema = require("../../utils/schemas/lang");

module.exports = {
    name : "help",
    aliases : ["aide"],
    run : async  (client, message, args) =>{
        
        const lang = await langSchema.findOne({
            guildId: message.guild.id
        }).lang || "en"

        message.reply("Mdr demmerde toi, t'as cru j'allais t'aider ?")

    }}

