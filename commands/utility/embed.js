const langSchema = require("../../utils/schemas/lang");
const mongoose = require("mongoose");
const ms = require("ms");

const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  chatInputApplicationCommandMention,
  ComponentType,
  Client,
  Message,
  ChannelSelectMenuBuilder,
  GuildChannel,
} = require("discord.js");
const embedSave = require("../../utils/schemas/embedSave");
const paginateEmbed = require("../../utils/functions/paginateEmbed");
const checkIfRowIsFull = require("../../utils/functions/addButton");

module.exports = {
  name: "embed",
  description: "Permet de créer un embed",
  aliases: ["embedbuilder"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    const lang =
      (await langSchema.findOne({ guildId: message.guild.id }).lang) || "en";

    let embed = new EmbedBuilder()
      .setDescription(
        "**Translating from 🇫🇷 to " +
          `:flag_${lang}: . . .** (This may take some time for the first time)`.replace(
            "en",
            "gb"
          )
      )
      .setColor("#ff0000");

    const msg = await message.channel
      .send({ embeds: [embed], fetch: true })
      .catch((err) => {});

    embed.setDescription("** **");
    embed.setColor("#000000");

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("Embed_" + message.id)
        .setPlaceholder(
          (await client.translator("Manage Embed", { to: lang })).text
        )
        .addOptions(
          {
            label: (await client.translator("Modifier le titre ", { to: lang }))
              .text,
            description: (
              await client.translator(
                "Permet de modifier le titre de l'embed",
                { to: lang }
              )
            ).text,
            emoji: "<:pencil:1088391673496739890>",
            value: "title_" + message.id,
          },
          {
            label: (
              await client.translator("Modifier la description ", { to: lang })
            ).text,
            description: (
              await client.translator(
                "Permet de modifier la description de l'embed",
                { to: lang }
              )
            ).text,
            emoji: "<:chat:1088410414238416927>",
            value: "description_" + message.id,
          },

          {
            label: (
              await client.translator("Modifier le footer ", { to: lang })
            ).text,
            description: (
              await client.translator(
                "Permet de modifier le footer de l'embed",
                { to: lang }
              )
            ).text,
            emoji: "<:footer:1088407732937293897>",
            value: "footer_" + message.id,
          },

          {
            label: (await client.translator("Modifier l'auteur ", { to: lang }))
              .text,
            description: (
              await client.translator(
                "Permet de modifier l'auteur de l'embed",
                { to: lang }
              )
            ).text,
            emoji: "<:author:1088410956972949594>",
            value: "author_" + message.id,
          },

          {
            label: (await client.translator("Modifier le temps ", { to: lang }))
              .text,
            description: (
              await client.translator(
                "Permet de modifier le timestamp de l'embed",
                { to: lang }
              )
            ).text,
            emoji: "<:time:1088408381569630259>",
            value: "time_" + message.id,
          },
          {
            label: (
              await client.translator("Modifier la couleur ", { to: lang })
            ).text,
            description: (
              await client.translator(
                "Permet de modifier la couleur de l'embed",
                { to: lang }
              )
            ).text,
            emoji: "<:color:1088391833710772305>",
            value: "color_" + message.id,
          },
          {
            label: (
              await client.translator("Modifier le thumbnail ", { to: lang })
            ).text,
            description: (
              await client.translator(
                "Permet de modifier le thumbnail de l'embed",
                { to: lang }
              )
            ).text,
            emoji: client.emoji.thumbnail,

            value: "thumbnail_" + message.id,
          },
          {
            label: (await client.translator("Edit the image ", { to: lang }))
              .text,
            description: (
              await client.translator("Permet de modifier l'image de l'embed", {
                to: lang,
              })
            ).text,
            emoji: client.emoji.image,
            value: "image_" + message.id,
          }
        )
    );
    console.log("apres le menu");

    const rowFields = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("EmbedFields_" + message.id)
        .setPlaceholder(
          (await client.translator("Manage Fields", { to: lang })).text
        )
        .addOptions(
          {
            label: (await client.translator("Ajouter un champ", { to: lang }))
              .text,
            description: (
              await client.translator("Permet d'ajouter un champ à l'embed", {
                to: lang,
              })
            ).text,
            emoji: "<:plus:1087830920188411974>",
            value: "addField_" + message.id,
          },
          {
            label: (await client.translator("Supprimer un champ", { to: lang }))
              .text,
            description: (
              await client.translator(
                "Permet de supprimer un champ de l'embed",
                { to: lang }
              )
            ).text,
            emoji: "<:minus:1087833497185558598>",
            value: "removeField_" + message.id,
          }
        )
    );
    console.log("apres le menu 2");

    let sendEmbed = new ButtonBuilder()
      .setCustomId("sendEmbed_" + message.id)
      .setLabel((await client.translator("Send the embed", { to: lang })).text)
      .setStyle("Success")
      .setEmoji("<:send:1088398689720094790>");
    let editEmbed = new ButtonBuilder()
      .setCustomId("editEmbed_" + message.id)
      .setLabel((await client.translator("Save the embed", { to: lang })).text)
      .setStyle("Primary")
      .setEmoji("<:edit:1088406519944593468>");

    let coppyEmbed = new ButtonBuilder()
      .setCustomId("coppyEmbed_" + message.id)
      .setLabel((await client.translator("Copy an embed", { to: lang })).text)
      .setStyle("Secondary")
      .setEmoji("<:copy:1088398623408140308>");

    let rowBack = new ButtonBuilder()
      .setCustomId("back_" + message.id)
      .setLabel(
        (await client.translator("Refaire votre choix", { to: lang })).text
      )
      .setStyle("Danger")
      .setEmoji(client.emoji.reback);

    let onlyLink = new ButtonBuilder()
      .setCustomId("onlyLink_" + message.id)
      .setLabel((await client.translator("Add a button", { to: lang })).text)
      .setStyle("Primary")
      .setEmoji(client.emoji.link);


    let savedEmbed = new ButtonBuilder()
      .setCustomId("savedEmbed_" + message.id)
      .setLabel((await client.translator("Saved embed", { to: lang })).text)
      .setStyle("Success")
      .setEmoji(client.emoji.saved);

    const rowOfButtons = {
      type: 1,
      components: [],
    };
    const newRow = {
      type: 1,
      components: [],
    };

    let componentsNew = [
      sendEmbed,
      editEmbed,
      coppyEmbed,
      rowBack,
      onlyLink,
      savedEmbed,
    ];
    for (let i = 0; i < componentsNew.length; i++) {
      let component = componentsNew[i];
      checkIfRowIsFull(rowOfButtons, newRow, component, message);
    }

    function removeDuplicates(buttonList) {
      let uniqueButtons = [];

      for (let i = 0; i < buttonList.length; i++) {
        let isDuplicate = false;
        for (let j = i + 1; j < buttonList.length; j++) {
          if (JSON.stringify(buttonList[i]) === JSON.stringify(buttonList[j])) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          uniqueButtons.push(buttonList[i]);
        }
      }
      return uniqueButtons;
    }

    rowOfButtons.components = removeDuplicates(rowOfButtons.components);
    newRow.components = removeDuplicates(newRow.components);

    const hasAnyButton = new ActionRowBuilder();

    let components = [row, rowFields, rowOfButtons];
    const lastEmbed = [];

    await msg
      .edit({ embeds: [embed], components: components, fetch: true })
      .catch((err) => {})
      .then(async (msg) => {
        const collectorMenu = message.channel.createMessageComponentCollector({
          filter: (m) => m.user.id == message.author.id,
          componentType: ComponentType.StringSelect,
          time: ms("15m"),
        });
        const collectorButton =
          await message.channel.createMessageComponentCollector({
            filter: (m) => m.user.id == message.author.id,
            componentType: ComponentType.Button,
            time: ms("15m"),
          });
        const collectorChannel =
          await message.channel.createMessageComponentCollector({
            filter: (m) => m.user.id == message.author.id,
            componentType: ComponentType.ChannelSelect,
            time: ms("15m"),
          });
        collectorChannel.on("collect", async (interaction) => {
          if (interaction.customId == "sendEmbeds_" + message.id) {
            await interaction.deferUpdate();
            let channel = interaction.values[0];
            channel = client.channels.cache.get(channel);
            let rowToSend = [hasAnyButton].filter(
              (x) => x.components.length > 0
            );
            if (rowToSend.length == 0) {
              channel.send({ embeds: [embed] });
            } else {
              channel.send({ embeds: [embed], components: rowToSend });
            }
            interaction.message.edit({
              embeds: [embed],
              components: components,
            });
          }
          //editEmbed_

          if (interaction.customId == "editEmbed_" + message.id) {
            await interaction.deferUpdate();
            let channel = interaction.values[0];
            channel = client.channels.cache.get(channel);
            interaction.message.edit({
              embeds: [embed],
              components: components,
            });
            let messageId = await client.awaitReply(
              message,
              (
                await client.translator(
                  "What is the message ID of the embed you want to edit?",
                  { to: lang }
                )
              ).text
            );

            messageId = messageId.content;

            if (isNaN(parseInt(messageId))) {
              client.embed(
                message,
                (
                  await client.translator("This is not a valid message ID", {
                    to: lang,
                  })
                ).text
              );
              interaction.message.edit({
                embeds: [embed],
                components: components,
              });
            }
            if (messageId) {
              channel.messages.fetch(messageId).then(async (msg) => {
                let embeds = new EmbedBuilder(msg.embeds[0].toJSON());
                lastEmbed.push(new EmbedBuilder({ ...embed.data }));
                embed = embeds;
                interaction.message.edit({
                  embeds: [embeds],
                  components: components,
                });
              });
            }
          }
          if (interaction.customId == "coppyEmbed_" + message.id) {
            await interaction.deferUpdate();
            let channel = interaction.values[0];
            channel = client.channels.cache.get(channel);
            interaction.message.edit({
              embeds: [embed],
              components: components,
            });
            let messageId = await client.awaitReply(
              message,
              (
                await client.translator(
                  "What is the message ID of the embed you want to copy?",
                  { to: lang }
                )
              ).text
            );

            messageId = messageId.content;

            if (isNaN(parseInt(messageId))) {
              client.embed(
                message,
                (
                  await client.translator("This is not a valid message ID", {
                    to: lang,
                  })
                ).text
              );
              interaction.message.edit({
                embeds: [embed],
                components: components,
              });
            }
            if (messageId) {
              channel.messages.fetch(messageId).then(async (msg) => {
                let embeds = new EmbedBuilder(msg.embeds[0].toJSON());
                lastEmbed.push(new EmbedBuilder({ ...embed.data }));
                embed = embeds;
                interaction.message.edit({
                  embeds: [embeds],
                  components: components,
                });
              });
            }
          }
        });
        collectorButton.on("collect", async (interaction) => {
          if (interaction.customId === "next" + message.id) {
            await interaction.deferUpdate();
            let components = interaction.message.components
              .filter((x, i) => i !== interaction.message.components.length - 1)
              .filter((x) =>
                x.components.map((r) => r.type == ComponentType.StringSelect)
              );

            interaction.message.edit({ components: [...components, newRow] });
          }
          if (interaction.customId === "backButt" + message.id) {
            await interaction.deferUpdate();
            let components = interaction.message.components
              .filter((x, i) => i !== interaction.message.components.length - 1)
              .filter((x) =>
                x.components.map((r) => r.type == ComponentType.StringSelect)
              );

            await interaction.message.edit({
              components: [...components, rowOfButtons],
            });
          }

          if (interaction.customId == "sendEmbed_" + message.id) {
            await interaction.deferUpdate();
            let menu = new ChannelSelectMenuBuilder()

              .addChannelTypes([0])
              .setCustomId("sendEmbeds_" + message.id)
              .setMaxValues(1)
              .setPlaceholder(
                (await client.translator("Select a channel", { to: lang })).text
              );

            let buttonBack = new ButtonBuilder()
              .setCustomId("annuler_" + message.id)
              .setLabel((await client.translator("Cancel", { to: lang })).text)
              .setStyle("Danger")
              .setEmoji(client.emoji.no);

            await interaction.message.edit({
              embeds: [embed],
              components: [
                new ActionRowBuilder().addComponents(menu),
                new ActionRowBuilder().addComponents(buttonBack),
              ],
            });
          }
          if (interaction.customId == "onlyLink_" + message.id) {
            await interaction.deferUpdate();

            let link = await client.awaitReply(
              message,
              (
                await client.translator(
                  "What is the link you want to add to the button ?",
                  { to: lang }
                )
              ).text
            );
            link = link.content;
            if (link) {
              if (!link.startsWith("https://") && !link.startsWith("http://"))
                return client.embed(
                  message,
                  (
                    await client.translator("This is not a valid link", {
                      to: lang,
                    })
                  ).text
                );
              let label = await client.awaitReply(
                message,
                (
                  await client.translator("What is the label of the button ?", {
                    to: lang,
                  })
                ).text
              );
              if (label) {
                label = label.content;
                let button = new ButtonBuilder()

                  .setStyle("Link")
                  .setLabel(label)
                  .setURL(link);

                let row = new ActionRowBuilder().addComponents(button);

                await interaction.followUp({
                  content: `${
                    (
                      await client.translator("Here is your preview", {
                        to: lang,
                      })
                    ).text
                  }`,
                  embeds: [embed],
                  components: [row],
                  ephemeral: true,
                });
                hasAnyButton.addComponents(button);
              }
            }

            await interaction.message.edit({ embeds: [embed] });
          }

          if (interaction.customId == "annuler_" + message.id) {
            await interaction.deferUpdate();
            await interaction.message.edit({
              embeds: [embed],
              components: components,
            });
          }
          //savedEmbed_
          if (interaction.customId == "savedEmbed_" + message.id) {
            let data = (await embedSave.findOne({
              guildId: message.guild.id,
            })) || { embeds: [] };
            console.log(data);
            if (data.embeds.length == 0)
              return client.embed(
                interaction,
                (
                  await client.translator("You don't have any saved embed", {
                    to: lang,
                  })
                ).text,
                true
              );
            await interaction.deferUpdate();
            let newEmbed = await paginateEmbed(
              interaction.message,
              message.author,
              embed
            );
            if (newEmbed) embed = newEmbed;
          }
          //save embed
          if (interaction.customId == "editEmbed_" + message.id) {
            await interaction.deferUpdate();
            let data = await embedSave.findOne({ guildId: message.guild.id });
            if (!data) {
              await new embedSave({
                guildId: message.guild.id,
                embeds: [embed.toJSON()],
                count: 1,
              }).save();
            } else {
              if (data.count == 5)
                return client.embed(
                  message,
                  (
                    await client.translator(
                      "You can't save more than 5 embeds par guild",
                      { to: lang }
                    )
                  ).text
                );
              data.count = data.count + 1;
              data.embeds.push(embed.toJSON());
              data.save();
            }

            //client embed
            return client.embed(
              message,
              (
                await client.translator("Your embed has been **saved** !", {
                  to: lang,
                })
              ).text
            );
          }
          if (interaction.customId == "coppyEmbed_" + message.id) {
            await interaction.deferUpdate();
            let channelMenu = new ChannelSelectMenuBuilder()
              .addChannelTypes([0])
              .setCustomId("coppyEmbed_" + message.id)
              .setMaxValues(1)
              .setPlaceholder(
                (
                  await client.translator(
                    "Select a channel where the message is",
                    { to: lang }
                  )
                ).text
              );
            let buttonBack = new ButtonBuilder()
              .setCustomId("annuler_" + message.id)
              .setLabel((await client.translator("Cancel", { to: lang })).text)
              .setStyle("Danger")
              .setEmoji(client.emoji.no);

            await interaction.message.edit({
              embeds: [embed],
              components: [
                new ActionRowBuilder().addComponents(channelMenu),
                new ActionRowBuilder().addComponents(buttonBack),
              ],
            });
          }
          if (interaction.customId == "back_" + message.id) {
            await interaction.deferUpdate();

            if (lastEmbed.length !== 0) {
              const prevEmbed = lastEmbed[lastEmbed.length - 1];
              embed = prevEmbed;

              interaction.message.edit({ embeds: [prevEmbed] });
            }
          }
        });
        collectorMenu.on("collect", async (interaction) => {
          if (interaction.customId == "EmbedFields_" + message.id) {
            switch (interaction.values[0]) {
              case "addField_" + message.id:
                await interaction.deferUpdate();
                lastEmbed.push(new EmbedBuilder({ ...embed.data }));
                const name = await client.awaitReply(
                  message,
                  (
                    await client.translator(
                      "What do you want to set as **name** ?",
                      { to: lang }
                    )
                  ).text,
                  60000,
                  lang
                );
                const value = await client.awaitReply(
                  message,
                  (
                    await client.translator(
                      "What do you want to set as **value** ?",
                      { to: lang }
                    )
                  ).text,
                  60000,
                  lang
                );
                if (name && value) {
                  embed.addFields({
                    name: name.content,
                    value: value.content,
                  });
                }
                await msg
                  .edit({
                    embeds: [embed],
                    components: components,
                    fetch: true,
                  })
                  .catch((err) => {});

                break;
              case "removeField_" + message.id:
                await interaction.deferUpdate();
                lastEmbed.push(new EmbedBuilder({ ...embed.data }));
                //wich field to remove
                if (embed.toJSON().fields == null) {
                  client.embed(
                    message,
                    (
                      await client.translator("There is no field to remove", {
                        to: lang,
                      })
                    ).text
                  );
                } else if (embed.toJSON().fields.length > 0) {
                  const ask = await client.awaitReply(
                    message,
                    (
                      await client.translator(
                        "Which field do you want to remove ?",
                        { to: lang }
                      )
                    ).text,
                    60000,
                    lang
                  );
                  if (ask) {
                    let field = ask.content;

                    if (parseInt(field)) {
                      field = parseInt(field) == 0 ? 0 : parseInt(field) - 1;
                    }

                    if (isNaN(field))
                      field = embed
                        .toJSON()
                        .fields.findIndex(
                          (f) => f.name == field || f.value == field
                        );

                    if (field) {
                      embed.spliceFields(field, 1);
                    } else if (field == 0) {
                      embed.spliceFields(field, 1);
                    } else {
                      client.embed(
                        message,
                        (
                          await client.translator("This field doesn't exist", {
                            to: lang,
                          })
                        ).text
                      );
                    }
                  }
                }
                await msg
                  .edit({
                    embeds: [embed],
                    components: components,
                    fetch: true,
                  })
                  .catch((err) => {});

                break;
            }
          }

          if (interaction.customId == "Embed_" + message.id) {
            switch (interaction.values[0]) {
              case "title_" + message.id:
                await interaction.deferUpdate();

                const title = await client.awaitReply(
                  message,
                  (
                    await client.translator(
                      "What do you want to set as **title** ?",
                      { to: lang }
                    )
                  ).text,
                  60000,
                  lang
                );
                console.log(title);
                if (title)
                  lastEmbed.push(new EmbedBuilder({ ...embed.data })),
                    embed.setTitle(title.content);
                await msg
                  .edit({
                    embeds: [embed],
                    components: components,
                    fetch: true,
                  })
                  .catch((err) => {});

                break;
              case "description_" + message.id:
                await interaction.deferUpdate();

                const description = await client.awaitReply(
                  message,
                  (
                    await client.translator(
                      "What do you want to set as **description** ?",
                      { to: lang }
                    )
                  ).text,
                  60000,
                  lang
                );
                if (description)
                  lastEmbed.push(new EmbedBuilder({ ...embed.data })),
                    embed.setDescription(description.content);
                await msg
                  .edit({
                    embeds: [embed],
                    components: components,
                    fetch: true,
                  })
                  .catch((err) => {});

                await description.delete().catch((err) => {});

                break;
              case "footer_" + message.id:
                await interaction.deferUpdate();
                lastEmbed.push(new EmbedBuilder({ ...embed.data }));

                const footer = await client.awaitReply(
                  message,
                  (
                    await client.translator(
                      "What do you want to set as **footer** ?",
                      { to: lang }
                    )
                  ).text,
                  60000,
                  lang
                );
                if (footer) {
                  const footerIcon = await client.awaitReply(
                    message,
                    (
                      await client.translator(
                        "Do you want to set a **footer icon** ?",
                        { to: lang }
                      )
                    ).text,
                    60000,
                    lang
                  );
                  if (
                    (footerIcon.content.toLowerCase() == "yes") |
                    (footerIcon.content.toLowerCase() == "oui") |
                    (footerIcon.content.toLowerCase() == "ui")
                  ) {
                    let footIc = await client.awaitReply(
                      message,
                      (
                        await client.translator(
                          "What do you want to set as **footer icon** ?",
                          { to: lang }
                        )
                      ).text,
                      60000,
                      lang
                    );
                    if (footIc.content.startsWith("http")) {
                      embed.setFooter({
                        text: footer.content,
                        iconURL: footIc.content,
                      });
                    } else if (footIc.attachments) {
                      embed.setFooter({
                        text: footer.content,
                        iconURL: footIc.attachments.first().url,
                      });
                    } else {
                      embed.setFooter({
                        text: footer.content,
                      });
                    }
                  } else {
                    embed.setFooter({
                      text: footer.content,
                    });
                  }
                }
                await msg
                  .edit({
                    embeds: [embed],
                    components: components,
                    fetch: true,
                  })
                  .catch((err) => {});

                break;
              case "author_" + message.id:
                await interaction.deferUpdate();
                lastEmbed.push(new EmbedBuilder({ ...embed.data }));
                const author = await client.awaitReply(
                  message,
                  (
                    await client.translator(
                      "What do you want to set as **author** ?",
                      { to: lang }
                    )
                  ).text,
                  60000,
                  lang
                );

                if (author) {
                  embed.setAuthor({
                    name: author.content,
                  });
                }
                await msg
                  .edit({
                    embeds: [embed],
                    components: components,
                    fetch: true,
                  })
                  .catch((err) => {});
                break;
              case "time_" + message.id:
                await interaction.deferUpdate();
                lastEmbed.push(new EmbedBuilder({ ...embed.data }));
                if (embed.toJSON().timestamp) {
                  embed.setTimestamp(null);
                } else {
                  embed.setTimestamp();
                }
                await msg
                  .edit({
                    embeds: [embed],
                    components: components,
                    fetch: true,
                  })
                  .catch((err) => {});

                break;
              case "color_" + message.id:
                await interaction.deferUpdate();
                lastEmbed.push(new EmbedBuilder({ ...embed.data }));
                let obj = {
                  red: "#ff0000",
                  green: "#00ff00",
                  blue: "#0000ff",
                  yellow: "#ffff00",
                  purple: "#ff00ff",
                  cyan: "#00ffff",
                  white: "#ffffff",
                  black: "#000000",
                  orange: "#ff7f00",
                  pink: "#ff1493",
                  brown: "#a52a2a",
                  grey: "#808080",
                  gray: "#808080",
                };
                const color = await client.awaitReply(
                  message,
                  (
                    await client.translator(
                      "What do you want to set as **color** ?",
                      { to: lang }
                    )
                  ).text,
                  60000,
                  lang
                );

                if (color && color.content.startsWith("#")) {
                  embed.setColor(color.content);
                } else if (color && obj[color.content.toLowerCase()]) {
                  embed.setColor(obj[color.content.toLowerCase()]);
                } else {
                  message
                    .reply(
                      (
                        await client.translator(
                          "You must send a **color** or a **hexadecimal**",
                          { to: lang }
                        )
                      ).text
                    )
                    .then((msg) => {
                      setTimeout(
                        async () => await msg.delete().catch((e) => {}),
                        3000
                      );
                    });
                }
                await msg
                  .edit({
                    embeds: [embed],
                    components: components,
                    fetch: true,
                  })
                  .catch((err) => {});

                break;
              case "thumbnail_" + message.id:
                await interaction.deferUpdate();
                lastEmbed.push(new EmbedBuilder({ ...embed.data }));
                const thumbnail = await client.awaitReply(
                  message,
                  (
                    await client.translator(
                      "What do you want to set as **thumbnail** ?",
                      { to: lang }
                    )
                  ).text,
                  60000,
                  lang
                );
                if (thumbnail) {
                  if (thumbnail.content.startsWith("http")) {
                    embed.setThumbnail(thumbnail.content);
                  } else if (thumbnail.attachments.size > 0) {
                    embed.setThumbnail(thumbnail.attachments.first().url);
                  } else {
                    message
                      .reply(
                        (
                          await client.translator(
                            "You must send an **image** or a **link**",
                            { to: lang }
                          )
                        ).text
                      )
                      .then((msg) => {
                        setTimeout(
                          async () => await msg.delete().catch((e) => {}),
                          3000
                        );
                      });
                  }
                }
                await msg
                  .edit({
                    embeds: [embed],
                    components: components,
                    fetch: true,
                  })
                  .catch((err) => {});

                break;

              case "image_" + message.id:
                await interaction.deferUpdate();
                lastEmbed.push(new EmbedBuilder({ ...embed.data }));
                const image = await client.awaitReply(
                  message,
                  (
                    await client.translator(
                      "What do you want to set as **image** ?",
                      { to: lang }
                    )
                  ).text,
                  60000,
                  lang
                );
                if (image) {
                  if (image.content.startsWith("http")) {
                    embed.setImage(image.content);
                  } else if (image.attachments.size > 0) {
                    embed.setImage(image.attachments.first().url);
                  } else {
                    message
                      .reply(
                        (
                          await client.translator(
                            "You must send an **image** or a **link**",
                            { to: lang }
                          )
                        ).text
                      )
                      .then((msg) => {
                        setTimeout(
                          async () => await msg.delete().catch((e) => {}),
                          3000
                        );
                      });
                  }
                }
                await msg
                  .edit({
                    embeds: [embed],
                    components: components,
                    fetch: true,
                  })
                  .catch((err) => {});

                break;
            }
          }
        });
      });
  },
};
