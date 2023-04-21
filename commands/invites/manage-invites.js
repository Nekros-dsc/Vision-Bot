const { UserSelectMenuBuilder } = require("@discordjs/builders")
const { ButtonBuilder, ActionRowBuilder, ComponentType } = require("discord.js")
const inviteSchema = require("../../utils/schemas/userInvites")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    name : "manage-invites",
    aliases : ["addinv","manageinvites","manageinv","addinvite"],
    run : async  (client, message, args) =>{
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        let data = await inviteSchema.findOne({guildId : message.guild.id, userId : member?.id})
        const lang = await client.getLang(message.guild.id)
        let members = []
        let number = 0;
        let numberWithdraw = 0;

        if(!number || !member) {
            let embed = new EmbedBuilder()
            .setTitle((await client.translator("Configuration de bonus invites", {to : lang})).text)
            embed.setDescription((await client.translator( `${client.emoji.persons}`+ ` **__Membres:__**  ${members.join("\n")} \n${client.emoji.add} **__Nombre d'invitations à ajoutés__:** **${number}**\n${client.emoji.remove}**__Nombre d'invitations à retirer__:** **${numberWithdraw}** `, {to : lang})).text)
            .setColor(client.config.defaultColor)
            
            let menu = new UserSelectMenuBuilder()
            .setCustomId("addinv" + message.id)
            .setPlaceholder((await client.translator("Choisissez un membre", {to : lang})).text)
            .setMinValues(1)
            .setMaxValues(25)

            let buttonNumber = new ButtonBuilder()
            .setCustomId("addinvNumber" + message.id)
            .setStyle("Primary")
            .setEmoji({
                name : client.emoji.add.split(":")[1].replace(">", ""),
                id : client.emoji.add.split(":")[2].replace(">", "")
            })

            let buttonNumberMinus = new ButtonBuilder()
            .setCustomId("addinvNumberMinus" + message.id)
            .setStyle("Primary")
            .setEmoji({
                name : client.emoji.remove.split(":")[1].replace(">", ""),
                id : client.emoji.remove.split(":")[2].replace(">", "")
            })

            let buttonConfirm = new ButtonBuilder()
            .setCustomId("addinvConfirm" + message.id)
            .setStyle("Secondary")
            .setEmoji({
                name : client.emoji.valid.split(":")[1].replace(">", ""),
                id : client.emoji.valid.split(":")[2].replace(">", "")
            })


            let rowMenu = new ActionRowBuilder()
            .addComponents(menu)
            let rowButton = new ActionRowBuilder()
            .addComponents(buttonConfirm,buttonNumber, buttonNumberMinus)

        



    
            message.channel.send({embeds : [embed], components : [rowMenu, rowButton]}).then(async (msg) => {
            const collectorMenu = message.channel.createMessageComponentCollector({componentType : ComponentType.UserSelect,filter : (i) => i.user.id == message.author.id, time : 60000})
            const collectorButton = message.channel.createMessageComponentCollector({componentType : ComponentType.Button,filter : (i) => i.user.id == message.author.id, time : 60000})
            collectorMenu.on("collect", async (i) => {
                if(i.customId == "addinv" + message.id) {
                    members = []
 
                    for (let is = 0; is< i.values.length;is++){
                        members.push(`<@${i.values[is]}>`)
        

               
                    }
                    embed.setDescription((await client.translator( `${client.emoji.persons}`+ ` **__Membres:__**  ${members.join("\n")} \n${client.emoji.add} **__Nombre d'invitations à ajoutés__:** **${number}**\n${client.emoji.remove}**__Nombre d'invitations à retirer__:** **${numberWithdraw}** `, {to : lang})).text)
                    i.update({embeds : [embed]})

                  
                }
            })
            collectorMenu.on("end", async (i) => {
                msg.components = msg.components.map((c) => {
                    c.components = c.components.map((b) => {
                        b.disabled = true
                        return b
                    })
                    return c
                })

                msg.edit({embeds : [embed], components : msg.components})
                  

            })
            collectorButton.on("collect", async (i) => {
                if(i.customId == "addinvNumber" + message.id) {
                    i.deferUpdate()

                    let askForNumber = await client.awaitReply(message, (await client.translator("Veuillez entrer le nombre d'invitations à ajouter", {to : lang})).text,limit = 60000, lang)
                    if(askForNumber){
                        console.log(askForNumber)
                        if(isNaN(askForNumber.content)) return client.embed(message, (await client.translator("Veuillez entrer un nombre valide", {to : lang})).text )
                     
                        number = askForNumber.content
                        embed.setDescription((await client.translator( `${client.emoji.persons}`+ ` **__Membres:__**  ${members.join("\n")} \n${client.emoji.add} **__Nombre d'invitations à ajoutés__:** **${number}**\n${client.emoji.remove}**__Nombre d'invitations à retirer__:** **${numberWithdraw}** `, {to : lang})).text)
                        i.message.edit({embeds : [embed]})

                    }
                }
                if(i.customId == "addinvNumberMinus" + message.id) {
                    i.deferUpdate()
                    let askForNumber = await client.awaitReply(message, (await client.translator("Veuillez entrer le nombre d'invitations à retirer", {to : lang})).text,limit = 60000, lang)
                    if(askForNumber){
                        if(isNaN(askForNumber.content)) return client.embed(message, (await client.translator("Veuillez entrer un nombre valide", {to : lang})).text )
                        numberWithdraw = askForNumber.content
                        embed.setDescription((await client.translator( `${client.emoji.persons}`+ ` **__Membres:__**  ${members.join("\n")} \n${client.emoji.add} **__Nombre d'invitations à ajoutés__:** **${number}**\n${client.emoji.remove}**__Nombre d'invitations à retirer__:** **${numberWithdraw}** `, {to : lang})).text)
                        i.message.edit({embeds : [embed]})
                    }
                }
                if(i.customId == "addinvConfirm" + message.id) {
                  await  i.deferUpdate()
                    for (let is = 0; is< members.length;is++){
                        let memberData = await inviteSchema.findOne({guildID : message.guild.id, userID : members[is].replace("<@!", "").replace(">", "")})
                        if(memberData){
                        memberData.bonusInvites += number
                       memberData.invites += numberWithdraw
                       memberData.bonusInvites  < 0 ? memberData.bonusInvites  = 0 : null
                         memberData.invites  < 0 ?   memberData.invites = 0 : null

                            memberData.save()
                    }
                  
                }
            }
            })
            collectorButton.on("end", async (i) => {
                msg.components = msg.components.map((c) => {
                    c.components = c.components.map((b) => {
                        b.disabled = true
                        return b
                    })
                    return c
                })

                msg.edit({embeds : [embed], components : msg.components})
            })





        })






        }
    }}

