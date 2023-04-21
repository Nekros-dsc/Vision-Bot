const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const client = require("../../index");
const langs = require("../schemas/lang");


async function paginateInvites(message, author, data) {

  
    const lang = (await langs.findOne({ guildId: message.guild.id }))?.lang || "en";
    const embedsPerPage = 10;
    const totalEmbeds = Math.ceil(data.invited.length / embedsPerPage);
    let savedEmbed = message.embeds[0]
    let oldComponents = message.components
  
    let currentPage = 1;
    let currentEmbed = 0;
  
    let buttonPage = new ButtonBuilder()
      .setLabel(`${currentPage}/${totalEmbeds}`)
      .setStyle("Secondary")
      .setCustomId(`page-${message.id}`)
      .setDisabled(true);
  
    let buttonPrevious = new ButtonBuilder()
      .setEmoji(client.emoji.left)
      .setStyle("Primary")
      .setCustomId(`previous-${message.id}`)
      .setDisabled(true);
  
    let buttonNext = new ButtonBuilder()
      .setEmoji(client.emoji.right)
      .setStyle("Primary")
      .setCustomId(`next-${message.id}`)
      .setDisabled(totalEmbeds <= 1);

      let backButton = new ButtonBuilder()
      .setCustomId("backInvites" + message.id)
      .setStyle("Secondary")
      .setEmoji({
          name : client.emoji.reback.split(":")[1].replace(">", ""),
          id : client.emoji.reback.split(":")[2].replace(">", "")
      })
  
    let row = new ActionRowBuilder().addComponents(buttonPrevious, buttonPage, buttonNext, backButton);
  
    let embeds = [];
    let fields = [];
  
    for (let i = 0; i < data.invited.length; i++) {
      const userId = data.invited[i];
      const count = data.invited.filter((id) => id === userId).length;
      const user = await client.users.fetch(userId).catch(() => {});
  
      if (!user) continue;
  
      fields.push({
        name: user.tag,
        value: `${count}x`,
      });
  
      if (fields.length >= embedsPerPage || i === data.invited.length - 1) {
        const embed = new EmbedBuilder()
          .setFields(fields)
          .setColor(client.config.defaultColor)
          .setThumbnail(message.guild.iconURL({ dynamic: true }))
          .toJSON();
  
        embeds.push(embed);
  
        fields = [];
      }
    }
  
    const msg = await message.edit({ embeds: [embeds[0]], components: [row] });
    const filter = (button) => button.user.id === author.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 150000 });
  
    collector.on("collect", async (button) => {
      await button.deferUpdate()

      if (button.customId == `previous-${message.id}`) {

        currentEmbed--;
        currentPage--;

      } else if (button.customId == `next-${message.id}`) {
        currentPage++;
        currentEmbed++;

      } else if (button.customId == `backInvites${message.id}`) {
        msg.edit({embeds : [savedEmbed], components : oldComponents})
        return collector.stop();
      }
  
      buttonPrevious.setDisabled(currentEmbed === 0);
      buttonNext.setDisabled(currentEmbed === embeds.length - 1);
  
      buttonPage.setLabel(`${currentPage}/${totalEmbeds}`);
  
      let embed = embeds[currentEmbed];
      console.log(currentEmbed)



      
  
      await msg.edit({ embeds: [embed], components: [row] });
    });
  }

  module.exports = paginateInvites;