const ecoSchema = require("../../utils/schemas/serverEco")
const langSchema = require("../../utils/schemas/lang");
const mongoose = require("mongoose")
const { EmbedBuilder } = require("discord.js")
module.exports = {
    name: "set-currency",
    description: "Change la monnaie du serveur",
    aliases: ["currency"],

    run : async (client, message, args) => {

        const templateEmbed = new EmbedBuilder()
        .setColor("#9E02D7")

        const lang = await langSchema.findOne({ guildId: message.guild.id }).lang || "en";

        let data = await ecoSchema.findOne({ guildId: message.guild.id }) || { customCurrency: "<:dollar:1088066873146474546>"};
        let currency = data.customCurrency;

        if(!args[0]) return message.reply({ embeds: [templateEmbed.setDescription(`${(await client.translator("Ma monnaie actuelle est", {to : lang})).text} ${currency}`)]}).catch(err => {});

        if(data.guildId) {
            if(data.customCurrency == args[0]) return message.reply({ embeds: [templateEmbed.setDescription(`**${args[0]}** ${(await client.translator("est déjà la monnaie actuelle du serveur !", {to : lang})).text}`)]});
            data.customCurrency = args[0];
        } else {
            data = await new ecoSchema({ guildId: message.guild.id, customCurrency: args[0]});
        }

        await data.save().catch(err => {})
        .then( async () => {
            return message.reply({ embeds: [templateEmbed.setDescription(`${data.customCurrency} ${(await client.translator("a été sauvegardé en tant que la nouvelle monnaie !", {to : lang})).text}`)]});
        });

    }
}