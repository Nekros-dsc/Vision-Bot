const userEcoSchema = require("../../utils/schemas/userEco")
const ecoSchema = require("../../utils/schemas/serverEco")
const mongoose = require("mongoose")
const { EmbedBuilder } = require("discord.js")
const langSchema = require("../../utils/schemas/lang");

module.exports = {
    name: "coins",
    description: "T'indique ton argent",
    aliases: ["bal"],

    run : async (client, message, args) => {

        const lang = await langSchema.findOne({ guildId: message.guild.id }).lang || "en";

        const embed = new EmbedBuilder()        
        .setDescription("**Translating from \🇫🇷 to " + `:flag_${lang}: . . .** (This may take some time for the first time)`.replace("en", "gb"))
        .setColor("#ff0000")

        const msg = await message.channel.send({ embeds: [embed], fetch: true}).catch(err => {})

        const templateEmbed = new EmbedBuilder()
        .setColor("#ff0000")

        let currencySymbol = await ecoSchema.findOne({ guildId: message.guild.id }) || { customCurrency: "<:dollar:1088066873146474546>"};
        let lastTransactions = currencySymbol.lastTransactions || [(await client.translator("Aucune transaction récente", {to : lang})).text]

        let data = await userEcoSchema.findOne({ guildId: message.guild.id, userId: message.author.id }) || { balance: "0"}
        templateEmbed.addFields({ name: currencySymbol.customCurrency + (await client.translator(" Solde disponible:", {to : lang})).text, value: "```" + data.balance + "```" })
        templateEmbed.addFields({ name: "<:shopping_cart:1088163886362021979> " + (await client.translator("Dernière transactions", {to : lang})).text + ":", value: "```" + lastTransactions.toString() + "```"})

        return msg.edit({embeds: [templateEmbed]}).catch(err => {})
    }
}