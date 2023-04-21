const mongoose = require("mongoose")
const ms = require("ms")
const langSchema = require("../../utils/schemas/lang");
const j2cSchema = require("../../utils/schemas/jointocreate");

const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, chatInputApplicationCommandMention, ComponentType, Client, Message, ChannelSelectMenuBuilder, GuildChannel } = require("discord.js")

module.exports = {
    name: "jointocreate",
    description: "Permet de configurer le join to create",
    aliases: ["j2c", "join2create"],
	/**
	 * 
	 * @param {Client} client 
	 * @param {Message} message 
	 * @param {String[]} args 
	 */

    run : async (client, message, args) => {
        //client.emoji et pas emojis
        let reply;

        let j2cData = await j2cSchema.findOne({
            guildId: message.guild.id
        }) 
        if(!j2cData) j2cData = {
            channelId : "Aucun",channelName : "Non définie",userLimit : "Aucun", 
            permissions: { 
        bl: false,
        wl: false,
        disconnect: false,
        changeName: false,
        muteAndDeaf: false,
        changeUserLimit: false}}




        const lang = await langSchema.findOne({ guildId: message.guild.id }).lang || "en";
        let oui = (await client.translator("Oui", {to : lang})).text
        let non = (await client.translator("Non", {to : lang})).text


        const translatorEmbed = new EmbedBuilder()        
        .setDescription("**Translating from \🇫🇷 to " + `:flag_${lang}: . . .** (This may take some time for the first time)`.replace("en", "gb"))
        .setColor("#ff0000")

        const msg = await message.channel.send({ embeds: [translatorEmbed], fetch: true}).catch(err => {})

        async function updateEmbed() {

            j2cData = await j2cSchema.findOne({
                guildId: message.guild.id
            }) 

        const embed = new EmbedBuilder()        
        .setColor(client.config.defaultColor)
        .addFields(
            {
            name:  (await client.translator("Salon vocal",{to : lang})).text ,
            value: ("<#" + j2cData?.channelId + ">").replace("<#undefined>", (await client.translator("Aucun",{to : lang})).text) || (await client.translator("Aucun",{to : lang})).text ,
            inline: true
            },
            {
            name:  (await client.translator("Nom du salon",{to : lang})).text ,
            value: j2cData?.channelName || "[username]",
            inline: true
            },
             {
            name:  (await client.translator("Limite d'utilisateurs",{to : lang})).text ,
            value: j2cData?.userLimit || "99",
            inline: true
            },{
                name:  (await client.translator(`${client.emoji.mute}` + " Muet par défaut",{to : lang})).text ,
                value:  (`${j2cData.muteByDefault}` || "false")

                .replace("true", oui)
                .replace("false", non) || 
                no ,
                inline: true
            }, {
                name:  (await client.translator(`${client.emoji.casque}` + " Sourd par défaut",{to : lang})).text ,
                value:   (`${j2cData?.deafByDefault}` || "false")
                .replace("true", oui)
                .replace("false", non )|| 
               no ,
                
                inline: true
            }, {
                name:  (await client.translator("・Variables",{to : lang})).text ,
                value:  (await client.translator("```[username] - Pseudo de l'utilisateur\n[userid] - Identifiant de l'utilisateur```",{to : lang})).text 
            }
            ,{
            name:  (await client.translator("・Permissions accordées",{to : lang})).text ,
            value: "```" + ((await client.translator(`Vocal Blacklist un utilisateur: ${j2cData.permissions.bl}\nVocal Whitelist un utilisateur: ${j2cData.permissions.wl}\nDéconnecter un utilisateur: ${j2cData.permissions.disconnect}\nRénommer le salon: ${j2cData.permissions.changeName}\nRendre muet sourd un utilisateur: ${j2cData.permissions.muteAndDeaf}\nChanger la limite d'utilisateurs: ${j2cData.permissions.changeUserLimit}`,{to : lang})).text).replaceAll("undefined", "❌").replaceAll("false", "❌").replaceAll("true", "✅") + "```"
            })

		const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('Embed_' + message.id)
					.setPlaceholder(( await client.translator("Manage Join To Create", {to : lang})).text)
					.addOptions(
						{
							label: ( await client.translator('Modifier le nom du salon',{to : lang})).text ,
							description: ( await client.translator('Permet de modifier le nom du salon',{to : lang})).text ,
							value: 'channelName_' + message.id,
						},
                        {
							label: ( await client.translator('Modifier la limite d\'utilisateurs',{to : lang})).text ,
							description: ( await client.translator('Permet de modifier la limite d\'utilisateurs',{to : lang})).text ,
							value: 'maxUsers_' + message.id,
						},
                        {
							label: ( await client.translator('Modifier muet par défaut',{to : lang})).text ,
							description: ( await client.translator('Permet de modifier le muet par défaut',{to : lang})).text ,
							value: 'mute_' + message.id,
						},
                        {
							label: ( await client.translator('Modifier le sourd par défaut',{to : lang})).text ,
							description: ( await client.translator('Permet de modifier le sourd par défaut',{to : lang})).text ,
							value: 'defean_' + message.id,  
                        }
						
					),
			);

            const row2 = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('Embed2_' + message.id)
                    .setMaxValues(6)
                    .setMinValues(0)
					.setPlaceholder(( await client.translator("Gérer les permissions", {to : lang})).text)
					.addOptions(
                        {
                            label: ( await client.translator('Blacklist un utilisateur',{to : lang})).text ,
                            description: ( await client.translator('Accorde la permission de blacklist un utilisateur',{to : lang})).text ,
                            value: 'bl_' + message.id,
                            default: j2cData.permissions.bl || false
                        },
                        {
                            label: ( await client.translator('Whitelist un utilisateur',{to : lang})).text ,
                            description: ( await client.translator('Accorde la permission de whitelist un utilisateur',{to : lang})).text ,
                            value: 'wl_' + message.id,
                            default: j2cData.permissions.wl || false
                        },
                        {
                            label: ( await client.translator('Déconnecter un utilisateur',{to : lang})).text ,
                            description: ( await client.translator('Accorde la permission de déconnecter un utilisateur',{to : lang})).text ,
                            value: 'kick_' + message.id,
                            default: j2cData.permissions.disconnect || false
                        },
                        {
                            label: ( await client.translator('Changer le nom du salon',{to : lang})).text ,
                            description: ( await client.translator('Accorde la permission de changer le nom du salon',{to : lang})).text ,
                            value: 'name_' + message.id,
                            default: j2cData.permissions.changeName || false
                        },
                        {
                            label: ( await client.translator("Rendre muet ou sourd un utilisateur",{to : lang})).text ,
                            description: ( await client.translator('Accorde la permission de rendre muet ou sourd un utilisateur',{to : lang})).text ,
                            value: 'deafOrMute_' + message.id,
                            default: j2cData.permissions.muteAndDeaf || false
                        },
                        {
                            label: ( await client.translator("Changer la limite d'utilisateur",{to : lang})).text ,
                            description: ( await client.translator('Accorde la permission de changer la limite d\'utilisateurs',{to : lang})).text ,
                            value: 'limit_' + message.id,
                            default: j2cData.permissions.changeUserLimit || false
                        },
					),
			);
            let button = new ButtonBuilder()
            .setStyle("Success")
            .setLabel(( await client.translator("Channel",{to : lang})).text)
            .setCustomId("channel_" + message.id)
            .setEmoji({
                name : client.emoji.channel.split(":")[1].split(">")[0],
                id : client.emoji.channel.split(":")[2].split(">")[0]

            })
            let row3 = new ActionRowBuilder()
            .addComponents(button)



        msg.edit({ embeds: [embed], components: [row, row2,row3]})

    }

    async function createData(schema, data) {
        let d = await new schema({
          guildId: message.guild.id,
          data
        });

        await d.save().catch(err => {});

    }

    updateEmbed()

    const collectorMenu = message.channel.createMessageComponentCollector({filter : m=> m.user.id == message.author.id,  componentType: ComponentType.StringSelect, time: ms("15m") });
    const collectorChannel = await message.channel.createMessageComponentCollector({filter : m=> m.user.id == message.author.id,  componentType: ComponentType.ChannelSelect, time: ms("15m") });
    const collectorButt = await message.channel.createMessageComponentCollector({filter : m=> m.user.id == message.author.id,  componentType: ComponentType.Button, time: ms("15m") });
    collectorButt.on('collect', async (interaction) => {
        if(interaction.customId == "channel_" + message.id){
            interaction.deferUpdate()
            let menuChannel = new ChannelSelectMenuBuilder()
            .setCustomId("channelSelect_" + message.id)
            .setPlaceholder(( await client.translator("Sélectionner un salon vocal",{to : lang})).text)
            .setChannelTypes([2])
            let row = new ActionRowBuilder()
            .addComponents(menuChannel)
            let buttonBack = new ButtonBuilder()
            .setStyle("Danger")
            .setEmoji(client.emoji.no)
            .setCustomId("back_" + message.id)
            let row2 = new ActionRowBuilder()
            .addComponents(buttonBack)
            interaction.message.edit({ components: [row,row2]})
        }
        if(interaction.customId == "back_" + message.id){
            interaction.deferUpdate()
            updateEmbed()
        }
    })
    collectorChannel.on('collect', async (interaction) => {
        if(interaction.customId == "channelSelect_" + message.id){
            interaction.deferUpdate()
            let channel = interaction.values[0]
            j2cData = await j2cSchema.findOne({
                guildId: message.guild.id
            }) || { permissions: []}
            if(j2cData.guildId) {
                j2cData.channelId = channel
                await j2cData.save().catch(err => {})
            } else {
                createData(j2cSchema, { guildId: message.guild.id, channelId: channel})
            }
            updateEmbed()
        }
    })


collectorMenu.on('collect', async (interaction) => {
  interaction.deferUpdate();

  const guildId = message.guild.id;
  let j2cData = await j2cSchema.findOne({ guildId }) || {
    permissions: {
      bl: false,
      wl: false,
      disconnect: false,
      changeName: false,
      muteAndDeaf: false,
      changeUserLimit: false,
    },
    guildId,
  };

  const togglePermission = async (permission) => {
    if (!j2cData.guildId) {
      createData(j2cSchema, { guildId });
      j2cData = await j2cSchema.findOne({ guildId });
    }
    j2cData.permissions[permission] = !j2cData.permissions[permission];
  };

  if (interaction.customId == 'Embed2_' + message.id) {
    const values = interaction.values;

    const kickPermissionEnabled = values.includes('kick_' + message.id);

    const newPerms = {
      bl: values.includes('bl_' + message.id),
      wl: values.includes('wl_' + message.id),
      disconnect: kickPermissionEnabled,
      changeName: values.includes('name_' + message.id),
      muteAndDeaf: values.includes('deafOrMute_' + message.id),
      changeUserLimit: values.includes('limit_' + message.id),
    };

    j2cData.permissions = newPerms;
    await j2cData.save();
    return updateEmbed();
  }

  switch (interaction.values[0]) {
    case 'defean_' + message.id:
      if (!j2cData.guildId) {
        createData(j2cSchema, { guildId, deafByDefault: false });
        j2cData = await j2cSchema.findOne({ guildId });
      }
      j2cData.deafByDefault = !j2cData.deafByDefault;
      break;

    case 'mute_' + message.id:
      if (!j2cData.guildId) {
        createData(j2cSchema, { guildId, muteByDefault: false });
        j2cData = await j2cSchema.findOne({ guildId });
      }
      j2cData.muteByDefault = !j2cData.muteByDefault;
      break;

    case 'maxUsers_' + message.id:
      const reply = await client.awaitReply(
        message,
        (await client.translator("Quel sera la limite d'utilisateurs ? (`0` pour aucune limite)", { to: lang }))
            .text,
              60000,
              lang
            );
            reply.delete().catch((err) => {});

            if (reply && !isNaN(parseInt(reply)) && parseInt(reply) < 99 && parseInt(reply) >= 0) {
              if (!j2cData.guildId) {
                createData(j2cSchema, { guildId: message.guild.id, userLimit: parseInt(reply) });
              } else {
                j2cData.userLimit = parseInt(reply);
              }
            } else {
              const replyMessage = await message.channel
                .send((await client.translator('Vous devez spécifier un nombre entre 0 et 99.', { to: lang })).text)
                .catch((err) => {});
              setTimeout(() => {
                replyMessage.delete().catch((err) => {});
              }, 3000);
            }
            break;
        }

      await j2cData.save()
      updateEmbed();
    });


    }
}