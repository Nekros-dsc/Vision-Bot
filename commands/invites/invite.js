
const { ButtonBuilder } = require("@discordjs/builders");
const inviteSchema = require("../../utils/schemas/userInvites");
const langSchema = require("../../utils/schemas/lang");
const { EmbedBuilder, ActionRowBuilder } = require("discord.js");
const paginateInvites = require("../../utils/functions/paginateInvites");
module.exports = {
    name: "invite",
    description: "Get yours invites",
    run: async (client, message, args) => {
     
        let lang = await langSchema.findOne({guildId : message.guild.id}).lang || "en"
        let data = await inviteSchema.findOne({guildId : message.guild.id, userId : message.author.id}) || {invites : 0, bonusInvites : 0, invalidInvites : 0, invited : [], invitedLeft : [], invites : 0}
        let button = new ButtonBuilder()
        .setCustomId("invited" + message.id)
        .setLabel((await client.translator("Personnes invités", {to : lang})).text)
        .setStyle("Secondary")
        .setEmoji({
           name : client.emoji.persons.split(":")[1].replace(">", ""),
           id : client.emoji.persons.split(":")[2].replace(">", "")
        })

        let button2 = new ButtonBuilder()
        .setCustomId("invitedLeft" + message.id)
        .setLabel((await client.translator("Personnes qui ont quitté", {to : lang})).text)
        .setStyle("Secondary")
        .setEmoji({
            name : client.emoji.no.split(":")[1].replace(">", ""),
            id : client.emoji.no.split(":")[2].replace(">", "")

        })

        let row = new ActionRowBuilder()
        .addComponents(button, button2)


        let embed = new EmbedBuilder()
        .setColor(client.config.defaultColor)
        .setTitle((await client.translator("Invitations", {to : lang})).text)
        .setDescription((await client.translator("Vous avez invité **{invites}** personnes sur ce serveur !", {to : lang})).text.replace("{invites}", data.invites))
        .addFields(
            {name : (await client.translator( `${client.emoji.valid} ` + "Valid invitation(s) ", {to : lang})).text, value : `${data.invites == null ? 0 : data.invites}`}, 
            {name : (await client.translator( `${client.emoji.mystere} `+ "Invitation(s) invalide(s) ", {to : lang})).text, value : `${data.invalidInvites == null ? 0 : data.invalidInvites}` },
            {  name :  `${client.emoji.bonus} `+  "Bonus Invite(s) ", value : `${data.bonusInvites == null ? 0 : data.bonusInvites}`},
            {name : (await client.translator(`${client.emoji.no} ` +  "Invité(s) parti(s)", {to : lang})).text, value : `${data.invitedLeft.length == null ? 0 : data.invitedLeft.length}`})
    
    message.channel.send({embeds : [embed], components : [row]}).then(async msg => {
        let filter = (button) => button.user.id == message.author.id
        let collector = msg.channel.createMessageComponentCollector({filter, time : 60000})
        data.invited = [...new Set(data.invited)]
        collector.on("collect", async (button) => {
            if(button.customId == "invited" + message.id){
              
                if(data.invited.length == 0) return button.reply({content : (await client.translator("Vous n'avez invité personne", {to : lang})).text, ephemeral : true})
                if(data.invited.length > 10){
                    button.deferUpdate()
                 
                    paginateInvites(msg,message.author,data,embed)
                }else{
                    button.deferUpdate()
                    let fields = [];

                    let counts = {};
                    data.invited.forEach(id => {
                        console.log(id)
                      counts[id] = (counts[id] || 0) + 1;
                    });
                  

                    await Promise.all(Object.keys(counts).map(async id => {
                        console.log(id)
                        let user = await client.users.fetch(id).catch((e) => {});
                        if(user){
                            fields.push({
                                name: user.tag,
                                value: `**${counts[id]}x**`,
                            });
                        }
                    }));
                    let backButton = new ButtonBuilder()
                    .setCustomId("backInvites" + message.id)
                    .setStyle("Secondary")
                    .setEmoji({
                        name : client.emoji.back.split(":")[1].replace(">", ""),
                        id : client.emoji.back.split(":")[2].replace(">", "")
                    })
                    let row = new ActionRowBuilder()
                    .addComponents(backButton)

                    
                    let embed = new EmbedBuilder()
                        .setTitle("Invitations")
                        .setDescription((await client.translator("Vous avez invité **{invites}** personnes sur ce serveur !", {to : lang})).text.replace("{invites}", data.invites.length))
                        .setColor(client.config.defaultColor)
                        .setFields(fields);
                    
                    msg.edit({ embeds: [embed], components : [row] });

                    
                    

                }
                
            }
            if(button.customId == "invitedLeft" + message.id){
                
                if(data.invitedLeft.length == 0) return button.reply({content : (await client.translator("Personne a leave", {to : lang})).text, ephemeral : true})
                if(data.invitedLeft.length > 10){
                    button.deferUpdate()
                    data.invited = [...new Set(data.invitedLeft)]
                 
                    paginateInvites(msg,message.author,data)
                }else{
                    data.invited = [...new Set(data.invitedLeft)]
                    button.deferUpdate()
                    let fields = [];

                    let counts = {};
                    data.invitedLeft.forEach(id => {
                        console.log(id)
                      counts[id] = (counts[id] || 0) + 1;
                    });
                  

                    await Promise.all(Object.keys(counts).map(async id => {
                        console.log(id)
                        let user = await client.users.fetch(id).catch((e) => {});
                        if(user){
                            fields.push({
                                name: user.tag,
                                value: `**${counts[id]}x**`,
                            });
                        }
                    }));

                    let backButton = new ButtonBuilder()
                    .setCustomId("backInvites" + message.id)
                    .setStyle("Secondary")
                    .setEmoji({
                        name : client.emoji.reback.split(":")[1].replace(">", ""),
                        id : client.emoji.reback.split(":")[2].replace(">", "")
                    })
                    let row = new ActionRowBuilder()
                    .addComponents(backButton)


                    
                    let embed = new EmbedBuilder()
                        .setTitle("Invitations")
                        .setDescription((await client.translator("**{invites}** personnes ont quitté !", {to : lang})).text.replace("{invites}", data.invitedLeft.length))
                        .setColor(client.config.defaultColor)
                        .setFields(fields);
                    
                    msg.edit({ embeds: [embed], components : [row] });

                    
                    

                }
                
            } 
            if(button.customId == "backInvites" + message.id){
                button.deferUpdate()
                button.message.edit({embeds : [embed], components : [row]})
            }

        })
    })

    
    }
   

}