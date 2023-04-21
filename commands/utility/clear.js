const { ButtonBuilder } = require("@discordjs/builders");
const inviteSchema = require("../../utils/schemas/userInvites");
const langSchema = require("../../utils/schemas/lang");
const { EmbedBuilder, ActionRowBuilder, Client, Message } = require("discord.js");
module.exports = {
    name: "clear",
    description: "Permet de supprimer des messages",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     * @returns 
     */
    run: async (client, message, args) => {

        let lang = await langSchema.findOne({guildId : message.guild.id}).lang || "en"
        if(message.mentions.members.first()) {
            let number = parseInt(args[1])
            if(!number) number  = 100
                message.delete()
                message.channel.messages.fetch({limit : 100})
                    .then((messages) => {
                        var filterUser = message.mentions.members.first().id;
                        var filtered = (messages.filter(m => m.author.id === filterUser).map(m=> m.id).slice(0,number))
                        message.channel.bulkDelete(filtered, true).catch(err => {})
                    
                       
                        let logs = null
                        if(logs) {
                          }
        
                    }).catch();
        
        }else  {
            let delamount = args[0];
            if (isNaN(delamount) ||  parseInt(delamount <= 0)) return;
        
            await message.channel.bulkDelete(parseInt(delamount) +1,true);
        
        
            await message.channel.send(`${(await client.translator(`J'ai supprimé ${delamount} messages`,{to : lang})).text}`).then(m =>{
                setTimeout(() => {
                    m.delete()
                }, 3000)
            })
        }
    }      
}