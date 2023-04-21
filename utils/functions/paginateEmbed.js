const { EmbedBuilder,ActionRowBuilder,ButtonBuilder } = require("discord.js");
const embedSchema = require("../../utils/schemas/embedSave");
const client = require("../../index");
const langs = require("../schemas/lang");
async function paginateEmbed(message,author,embedData ){
    return new Promise(async (resolve, reject) => {
    let compo = message.components;

    const lang = await  langs.findOne({ guildId: message.guild.id }).lang || "en";
    let page = 1;
    let embedParPage = 1;
    let data = await embedSchema.findOne({ guildId: message.guild.id }) 
    let totalPage = Math.ceil(data.embeds.length / embedParPage);
    let embed = new EmbedBuilder(data.embeds[page - 1])

    let buttonUse = new ButtonBuilder()
    .setEmoji(client.emoji.use)
    .setStyle("Success")
    .setLabel((await client.translator("Use", {to : lang})).text)
    .setCustomId("use" + message.id)

    let buttonLeft = new ButtonBuilder()
    .setEmoji(client.emoji.left)
    .setStyle("Primary")
    .setCustomId("previous" + message.id)
    .setDisabled(page == 1)

    let buttonPage = new ButtonBuilder()
    .setLabel(page + "/" + totalPage)
    .setStyle("Secondary")
    .setCustomId("page" + message.id)
    .setDisabled(true)

    let button2 = new ButtonBuilder()
    .setEmoji(client.emoji.right)
    .setStyle("Primary")
    .setCustomId("next" + message.id)
    .setDisabled(page == totalPage)

    const deleteEmbed = new ButtonBuilder()
    .setEmoji(client.emoji.reback)
    .setLabel((await client.translator("Delete", {to : lang})).text)
    .setStyle("Danger")
    .setCustomId("delete" + message.id)


    let row = new ActionRowBuilder()
    .addComponents(buttonUse,buttonLeft,buttonPage,button2,deleteEmbed)

    await message.edit({ embeds: [embed], components: [row] })
    const filter = (button) => button.user.id === author.id;
    const collector = message.createMessageComponentCollector({ filter, time: 150000 });
    collector.on("collect", async (button) => {
        if (button.customId == "previous" + message.id) {
            page--;
            embed = new EmbedBuilder(data.embeds[page - 1])
            buttonPage.setLabel(page + "/" + totalPage)
            buttonLeft.setDisabled(page == 1)
            button2.setDisabled(page == totalPage)
            await button.update({ embeds: [embed], components: [row] })
        }
        if (button.customId == "next" + message.id) {
            page++;
            embed = new EmbedBuilder(data.embeds[page - 1])
            buttonPage.setLabel(page + "/" + totalPage)
            buttonLeft.setDisabled(page == 1)
            button2.setDisabled(page == totalPage)
            await button.update({ embeds: [embed], components: [row] })
        }
        if (button.customId == "delete" + message.id) {
            await button.deferUpdate()
            data.embeds.splice(page - 1, 1)
            data.count = data.count - 1
            data.save()
            await message.edit({ embeds : [message.embeds[0]],components : compo })
            collector.stop()
        }
        if (button.customId == "use" + message.id) {
            await button.deferUpdate()
            await message.edit({ embeds : [embed],components : compo })
            resolve(embed)
            collector.stop()

        }

    })
})







}

module.exports = paginateEmbed;