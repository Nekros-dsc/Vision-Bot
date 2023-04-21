const { EmbedBuilder } = require('@discordjs/builders');
const client = require('../../index')
const guildSetup = require('../../utils/schemas/guildSetup')
const langSchema = require('../../utils/schemas/lang')
const { generateInvitesCache, isEqual } = require('../../utils/functions/invites')
const lastData = require('../../utils/schemas/lastData')
const invitesSchema = require("../../utils/schemas/userInvites")

client.on("guildMemberRemove", async (member) => {
    const guildInvites = generateInvitesCache(member.guild.invites.cache);
    const lang = await langSchema.findOne({ guildId: member.guild.id }).lang || { lang: "en" };
   let lastDatas = await lastData.findOne({ userId: member.id, guildId: member.guild.id })
    if(!lastDatas) return;
    let inviter = lastDatas.inviterId == "Vanity" ? "Vanity" : client.users.cache.get(lastDatas.inviterId)



    if (inviter && inviter !== "Vanity" ){
    //delete him an invite 
    let data = await invitesSchema.findOne({
        userId: inviter.id,
        guildId: member.guild.id
    })
    if(data){
    data.invites = parseInt(data.invites == null ? 0 : data.invites) - 1
    
    data.invitedLeft = data.invitedLeft.push(member.id)

    data.invalidInvites = parseInt(data.invalidInvites == null ? 0 : data.invalidInvites) + 1

    await data.save()
}
    } else {
        let message = await  guildSetup.findOne({
            guildId: member.guild.id
        })
        if(!message) return;
        if(message.leaveSettings.leaveEmbedEnabled == true){
            if(message.leaveSettings.leaveChannel == null) return;
            if(message.leaveSettings.leaveEmbed == null) return;
            let channel = member.guild.channels.cache.get(message.leaveSettings.leaveChannel)
            if(!channel) return;
            let embed = new EmbedBuilder(message.leaveSettings.leaveEmbed)
            embed = embed.toJSON()
            embed = embed.description.replace(/{user.id}/g, member.user.id)
            embed = embed.description.replace(/\n/g, "\n")
            embed = embed.description.replace(/{user.username}/g, member.user.username)
            embed = embed.description.replace(/{user.discriminator}/g, member.user.discriminator)
            embed = embed.description.replace(/{user.mention}/g, member.user.toString())
            embed = embed.description.replace(/{user.avatar}/g, member.user.avatarURL())
            embed = embed.description.replace(/{user.bot}/g, member.user.bot)
            embed = embed.description.replace(/{user.createdAt}/g, member.user.createdAt)
            embed = embed.description.replace(/{user.createdTimestamp}/g, member.user.createdTimestamp)
            embed = embed.description.replace(/{user.tag}/g, member.user.tag)
            embed = embed.description.replace(/{user.inviter}/g, inviter)
            embed = embed.description.replace(/{user}/g, member.user.tag)
            embed = embed.description.replace(/{guild.name}/g, member.guild.name)
            embed = embed.description.replace(/{guild.id}/g, member.guild.id)
            embed = embed.description.replace(/{guild.memberCount}/g, member.guild.memberCount)
            embed = embed.description.replace(/{guild.createdAt}/g, member.guild.createdAt)
            embed = embed.description.replace(/{guild.createdTimestamp}/g, member.guild.createdTimestamp)
            embed = embed.title.replace(/{user.id}/g, member.user.id)
            embed = embed.title.replace(/{user.username}/g, member.user.username)
            embed = embed.title.replace(/{user.discriminator}/g, member.user.discriminator)
            embed = embed.title.replace(/{user.mention}/g, member.user.toString())
            embed = embed.title.replace(/{user.avatar}/g, member.user.avatarURL())
            embed = embed.title.replace(/{user.bot}/g, member.user.bot)
            embed = embed.title.replace(/{user.createdAt}/g, member.user.createdAt)
            embed = embed.title.replace(/{user.createdTimestamp}/g, member.user.createdTimestamp)
            embed = embed.title.replace(/{user.tag}/g, member.user.tag)
            embed = embed.title.replace(/{user.inviter}/g, inviter)
            embed = embed.title.replace(/{user}/g, member.user.tag)
            embed = embed.title.replace(/{user.inviter.tag}/g, inviter.tag)
            embed = embed.title.replace(/{user.inviter.id}/g, inviter.id)
            embed = embed.title.replace(/{user.inviter.mention}/g, inviter.toString())
            embed = embed.title.replace(/{user.inviter.username}/g, inviter.username)
            embed = embed.title.replace(/{user.inviter.discriminator}/g, inviter.discriminator)
            embed = embed.title.replace(/{guild.name}/g, member.guild.name)
            embed = embed.title.replace(/{guild.id}/g, member.guild.id)
            embed = embed.title.replace(/{guild.memberCount}/g, member.guild.memberCount)
            embed = embed.title.replace(/{guild.createdAt}/g, member.guild.createdAt)
            embed = embed.title.replace(/{guild.createdTimestamp}/g, member.guild.createdTimestamp)
            embed = embed.footer.text.replace(/{user.id}/g, member.user.id)
            embed = embed.footer.text.replace(/{user.username}/g, member.user.username)
            embed = embed.footer.text.replace(/{user.discriminator}/g, member.user.discriminator)
            embed = embed.footer.text.replace(/{user.mention}/g, member.user.toString())
            embed = embed.footer.text.replace(/{user.avatar}/g, member.user.avatarURL())
            embed = embed.footer.text.replace(/{user.bot}/g, member.user.bot)
            embed = embed.footer.text.replace(/{user.createdAt}/g, member.user.createdAt)
            embed = embed.footer.text.replace(/{user.createdTimestamp}/g, member.user.createdTimestamp)
            embed = embed.footer.text.replace(/{user.tag}/g, member.user.tag)
            embed = embed.footer.text.replace(/{user.inviter}/g, inviter)
            embed = embed.footer.text.replace(/{user}/g, member.user.tag)
            embed = embed.footer.text.replace(/{guild.name}/g, member.guild.name)
            embed = embed.footer.text.replace(/{guild.id}/g, member.guild.id)
            embed = embed.footer.text.replace(/{guild.memberCount}/g, member.guild.memberCount)
            embed = embed.footer.text.replace(/{guild.createdAt}/g, member.guild.createdAt)
            embed = embed.footer.text.replace(/{guild.createdTimestamp}/g, member.guild.createdTimestamp)
            embed = embed.author.name.replace(/{user.id}/g, member.user.id)
            embed = embed.author.name.replace(/{user.username}/g, member.user.username)
            embed = embed.author.name.replace(/{user.discriminator}/g, member.user.discriminator)
            embed = embed.author.name.replace(/{user.mention}/g, member.user.toString())
            embed = embed.author.name.replace(/{user.avatar}/g, member.user.avatarURL())
            embed = embed.author.name.replace(/{user.bot}/g, member.user.bot)
            embed = embed.author.name.replace(/{user.createdAt}/g, member.user.createdAt)
            embed = embed.author.name.replace(/{user.createdTimestamp}/g, member.user.createdTimestamp)
            embed = embed.author.name.replace(/{user.tag}/g, member.user.tag)
            embed = embed.author.name.replace(/{user.inviter}/g, inviter)
            embed = embed.author.name.replace(/{user}/g, member.user.tag)
            embed = embed.author.name.replace(/{guild.name}/g, member.guild.name)
            embed = embed.author.name.replace(/{guild.id}/g, member.guild.id)
            embed = embed.author.name.replace(/{guild.memberCount}/g, member.guild.memberCount)
            embed = embed.author.name.replace(/{guild.createdAt}/g, member.guild.createdAt)
            embed = embed.author.name.replace(/{guild.createdTimestamp}/g, member.guild.createdTimestamp)
            embed.fields.forEach(field => {
                field.name = field.name.replace(/{user.id}/g, member.user.id)
                field.name = field.name.replace(/{user.username}/g, member.user.username)
                field.name = field.name.replace(/{user.discriminator}/g, member.user.discriminator)
                field.name = field.name.replace(/{user.mention}/g, member.user.toString())
                field.name = field.name.replace(/{user.avatar}/g, member.user.avatarURL())
                field.name = field.name.replace(/{user.bot}/g, member.user.bot)
                field.name = field.name.replace(/{user.createdAt}/g, member.user.createdAt)
                field.name = field.name.replace(/{user.createdTimestamp}/g, member.user.createdTimestamp)
                field.name = field.name.replace(/{user.tag}/g, member.user.tag)
                field.name = field.name.replace(/{user.inviter}/g, inviter)
                field.name = field.name.replace(/{user}/g, member.user.tag)
                field.name = field.name.replace(/{user.inviter.tag}/g, inviter.tag)
                field.name = field.name.replace(/{user.inviter.id}/g, inviter.id)
                field.name = field.name.replace(/{user.inviter.mention}/g, inviter.toString())
                field.name = field.name.replace(/{user.inviter.username}/g, inviter.username)
                field.name = field.name.replace(/{user.inviter.discriminator}/g, inviter.discriminator)
                field.name = field.name.replace(/{guild.name}/g, member.guild.name)
                field.name = field.name.replace(/{guild.id}/g, member.guild.id)
                field.name = field.name.replace(/{guild.memberCount}/g, member.guild.memberCount)
                field.name = field.name.replace(/{guild.createdAt}/g, member.guild.createdAt)
                field.name = field.name.replace(/{guild.createdTimestamp}/g, member.guild.createdTimestamp)
                field.value = field.value.replace(/{user.id}/g, member.user.id)
                field.value = field.value.replace(/{user.username}/g, member.user.username)
                field.value = field.value.replace(/{user.discriminator}/g, member.user.discriminator)
                field.value = field.value.replace(/{user.mention}/g, member.user.toString())
                field.value = field.value.replace(/{user.avatar}/g, member.user.avatarURL())
                field.value = field.value.replace(/{user.bot}/g, member.user.bot)
                field.value = field.value.replace(/{user.createdAt}/g, member.user.createdAt)
                field.value = field.value.replace(/{user.createdTimestamp}/g, member.user.createdTimestamp)
                field.value = field.value.replace(/{user.tag}/g, member.user.tag)
                field.value = field.value.replace(/{user.inviter}/g, inviter)
                field.value = field.value.replace(/{user}/g, member.user.tag)
                field.value = field.value.replace(/{guild.name}/g, member.guild.name)
                field.value = field.value.replace(/{guild.id}/g, member.guild.id)
                field.value = field.value.replace(/{guild.memberCount}/g, member.guild.memberCount)
                field.value = field.value.replace(/{guild.createdAt}/g, member.guild.createdAt)
                field.value = field.value.replace(/{guild.createdTimestamp}/g, member.guild.createdTimestamp)
            })
            channel.send({ embeds: [embed] })

    } else if (dataGuild.leaveSettings.leaveMessageEnabled == true) {
        if(dataGuild.leaveSettings.leaveChannel == null) return;
        let channel = member.guild.channels.cache.get(dataGuild.leaveSettings.leaveChannel)
        if(!channel) return;
        let message = dataGuild.leaveSettings.leaveMessage
        if(!message) return;  
        message = message.replace(/{user}/g, member.user.tag)
        message = message.replace(/\n/g, "\n")
        message = message.replace(/{user.id}/g, member.user.id)
        message = message.replace(/{user.mention}/g, member.user.toString())
        message = message.replace(/{user.username}/g, member.user.username)
        message = message.replace(/{user.discriminator}/g, member.user.discriminator)
        message = message.replace(/{user.avatar}/g, member.user.avatarURL())
        message = message.replace(/{user.bot}/g, member.user.bot)
        message = message.replace(/{user.createdAt}/g, member.user.createdAt)
        message = message.replace(/{user.createdTimestamp}/g, member.user.createdTimestamp)
        message = message.replace(/{user.tag}/g, member.user.tag)
        message = message.replace(/{user.inviter}/g, inviter)
        message = message.replace(/{guild.name}/g, member.guild.name)
        message = message.replace(/{guild.id}/g, member.guild.id)
        message = message.replace(/{guild.memberCount}/g, member.guild.memberCount)
        message = message.replace(/{guild.createdAt}/g, member.guild.createdAt)
        message = message.replace(/{guild.createdTimestamp}/g, member.guild.createdTimestamp)
        channel.send({ content: message })


    }
}
    let dataGuild = await guildSetup.findOne({
        guildId: member.guild.id
    }) 
    if(!dataGuild) return;


    
        
    


    if(dataGuild.leaveSettings.leaveEmbedEnabled == true){
        if(dataGuild.leaveSettings.leaveChannel == null) return;
        let channel = member.guild.channels.cache.get(dataGuild.leaveSettings.leaveChannel)
        if(!channel) return;
        let embed = new EmbedBuilder(dataGuild.leaveSettings.leaveEmbed)
        embed = embed.toJSON()
        embed = embed.description.replace(/{user.id}/g, member.user.id)
        embed = embed.description.replace(/{user.username}/g, member.user.username)
        embed = embed.description.replace(/{user.discriminator}/g, member.user.discriminator)
        embed = embed.description.replace(/{user.mention}/g, member.user.toString())
        embed = embed.description.replace(/{user.avatar}/g, member.user.avatarURL())
        embed = embed.description.replace(/{user.bot}/g, member.user.bot)
        embed = embed.description.replace(/{user.createdAt}/g, member.user.createdAt)
        embed = embed.description.replace(/{user.createdTimestamp}/g, member.user.createdTimestamp)
        embed = embed.description.replace(/{user.tag}/g, member.user.tag)
        embed = embed.description.replace(/{user.inviter}/g, inviter)
        embed = embed.description.replace(/{user}/g, member.user.tag)
        embed = embed.description.replace(/{user.inviter.tag}/g, inviter.tag)
        embed = embed.description.replace(/{user.inviter.id}/g, inviter.id)
        embed = embed.description.replace(/{user.inviter.mention}/g, inviter.toString())
        embed = embed.description.replace(/{user.inviter.username}/g, inviter.username)
        embed = embed.description.replace(/{user.inviter.discriminator}/g, inviter.discriminator)
        embed = embed.description.replace(/{guild.name}/g, member.guild.name)
        embed = embed.description.replace(/{guild.id}/g, member.guild.id)
        embed = embed.description.replace(/{guild.memberCount}/g, member.guild.memberCount)
        embed = embed.description.replace(/{guild.createdAt}/g, member.guild.createdAt)
        embed = embed.description.replace(/{guild.createdTimestamp}/g, member.guild.createdTimestamp)
        embed = embed.title.replace(/{user.id}/g, member.user.id)
        embed = embed.title.replace(/{user.username}/g, member.user.username)
        embed = embed.title.replace(/{user.discriminator}/g, member.user.discriminator)
        embed = embed.title.replace(/{user.mention}/g, member.user.toString())
        embed = embed.title.replace(/{user.avatar}/g, member.user.avatarURL())
        embed = embed.title.replace(/{user.bot}/g, member.user.bot)
        embed = embed.title.replace(/{user.createdAt}/g, member.user.createdAt)
        embed = embed.title.replace(/{user.createdTimestamp}/g, member.user.createdTimestamp)
        embed = embed.title.replace(/{user.tag}/g, member.user.tag)
        embed = embed.title.replace(/{user.inviter}/g, inviter)
        embed = embed.title.replace(/{user}/g, member.user.tag)
        embed = embed.title.replace(/{user.inviter.tag}/g, inviter.tag)
        embed = embed.title.replace(/{user.inviter.id}/g, inviter.id)
        embed = embed.title.replace(/{user.inviter.mention}/g, inviter.toString())
        embed = embed.title.replace(/{user.inviter.username}/g, inviter.username)
        embed = embed.title.replace(/{user.inviter.discriminator}/g, inviter.discriminator)
        embed = embed.title.replace(/{guild.name}/g, member.guild.name)
        embed = embed.title.replace(/{guild.id}/g, member.guild.id)
        embed = embed.title.replace(/{guild.memberCount}/g, member.guild.memberCount)
        embed = embed.title.replace(/{guild.createdAt}/g, member.guild.createdAt)
        embed = embed.title.replace(/{guild.createdTimestamp}/g, member.guild.createdTimestamp)
        embed = embed.footer.text.replace(/{user.id}/g, member.user.id)
        embed = embed.footer.text.replace(/{user.username}/g, member.user.username)
        embed = embed.footer.text.replace(/{user.discriminator}/g, member.user.discriminator)
        embed = embed.footer.text.replace(/{user.mention}/g, member.user.toString())
        embed = embed.footer.text.replace(/{user.avatar}/g, member.user.avatarURL())
        embed = embed.footer.text.replace(/{user.bot}/g, member.user.bot)
        embed = embed.footer.text.replace(/{user.createdAt}/g, member.user.createdAt)
        embed = embed.footer.text.replace(/{user.createdTimestamp}/g, member.user.createdTimestamp)
        embed = embed.footer.text.replace(/{user.tag}/g, member.user.tag)
        embed = embed.footer.text.replace(/{user.inviter}/g, inviter)
        embed = embed.footer.text.replace(/{user}/g, member.user.tag)
        embed = embed.footer.text.replace(/{user.inviter.tag}/g, inviter.tag)
        embed = embed.footer.text.replace(/{user.inviter.id}/g, inviter.id)
        embed = embed.footer.text.replace(/{user.inviter.mention}/g, inviter.toString())
        embed = embed.footer.text.replace(/{user.inviter.username}/g, inviter.username)
        embed = embed.footer.text.replace(/{user.inviter.discriminator}/g, inviter.discriminator)
        embed = embed.footer.text.replace(/{guild.name}/g, member.guild.name)
        embed = embed.footer.text.replace(/{guild.id}/g, member.guild.id)
        embed = embed.footer.text.replace(/{guild.memberCount}/g, member.guild.memberCount)
        embed = embed.footer.text.replace(/{guild.createdAt}/g, member.guild.createdAt)
        embed = embed.footer.text.replace(/{guild.createdTimestamp}/g, member.guild.createdTimestamp)
        embed = embed.author.name.replace(/{user.id}/g, member.user.id)
        embed = embed.author.name.replace(/{user.username}/g, member.user.username)
        embed = embed.author.name.replace(/{user.discriminator}/g, member.user.discriminator)
        embed = embed.author.name.replace(/{user.mention}/g, member.user.toString())
        embed = embed.author.name.replace(/{user.avatar}/g, member.user.avatarURL())
        embed = embed.author.name.replace(/{user.bot}/g, member.user.bot)
        embed = embed.author.name.replace(/{user.createdAt}/g, member.user.createdAt)
        embed = embed.author.name.replace(/{user.createdTimestamp}/g, member.user.createdTimestamp)
        embed = embed.author.name.replace(/{user.tag}/g, member.user.tag)
        embed = embed.author.name.replace(/{user.inviter}/g, inviter)
        embed = embed.author.name.replace(/{user}/g, member.user.tag)
        embed = embed.author.name.replace(/{user.inviter.tag}/g, inviter.tag)
        embed = embed.author.name.replace(/{user.inviter.id}/g, inviter.id)
        embed = embed.author.name.replace(/{user.inviter.mention}/g, inviter.toString())
        embed = embed.author.name.replace(/{user.inviter.username}/g, inviter.username)
        embed = embed.author.name.replace(/{user.inviter.discriminator}/g, inviter.discriminator)
        embed = embed.author.name.replace(/{guild.name}/g, member.guild.name)
        embed = embed.author.name.replace(/{guild.id}/g, member.guild.id)
        embed = embed.author.name.replace(/{guild.memberCount}/g, member.guild.memberCount)
        embed = embed.author.name.replace(/{guild.createdAt}/g, member.guild.createdAt)
        embed = embed.author.name.replace(/{guild.createdTimestamp}/g, member.guild.createdTimestamp)
        embed.fields.forEach(field => {
            field.name = field.name.replace(/{user.id}/g, member.user.id)
            field.name = field.name.replace(/{user.username}/g, member.user.username)
            field.name = field.name.replace(/{user.discriminator}/g, member.user.discriminator)
            field.name = field.name.replace(/{user.mention}/g, member.user.toString())
            field.name = field.name.replace(/{user.avatar}/g, member.user.avatarURL())
            field.name = field.name.replace(/{user.bot}/g, member.user.bot)
            field.name = field.name.replace(/{user.createdAt}/g, member.user.createdAt)
            field.name = field.name.replace(/{user.createdTimestamp}/g, member.user.createdTimestamp)
            field.name = field.name.replace(/{user.tag}/g, member.user.tag)
            field.name = field.name.replace(/{user.inviter}/g, inviter)
            field.name = field.name.replace(/{user}/g, member.user.tag)
            field.name = field.name.replace(/{user.inviter.tag}/g, inviter.tag)
            field.name = field.name.replace(/{user.inviter.id}/g, inviter.id)
            field.name = field.name.replace(/{user.inviter.mention}/g, inviter.toString())
            field.name = field.name.replace(/{user.inviter.username}/g, inviter.username)
            field.name = field.name.replace(/{user.inviter.discriminator}/g, inviter.discriminator)
            field.name = field.name.replace(/{guild.name}/g, member.guild.name)
            field.name = field.name.replace(/{guild.id}/g, member.guild.id)
            field.name = field.name.replace(/{guild.memberCount}/g, member.guild.memberCount)
            field.name = field.name.replace(/{guild.createdAt}/g, member.guild.createdAt)
            field.name = field.name.replace(/{guild.createdTimestamp}/g, member.guild.createdTimestamp)
            field.value = field.value.replace(/{user.id}/g, member.user.id)
            field.value = field.value.replace(/{user.username}/g, member.user.username)
            field.value = field.value.replace(/{user.discriminator}/g, member.user.discriminator)
            field.value = field.value.replace(/{user.mention}/g, member.user.toString())
            field.value = field.value.replace(/{user.avatar}/g, member.user.avatarURL())
            field.value = field.value.replace(/{user.bot}/g, member.user.bot)
            field.value = field.value.replace(/{user.createdAt}/g, member.user.createdAt)
            field.value = field.value.replace(/{user.createdTimestamp}/g, member.user.createdTimestamp)
            field.value = field.value.replace(/{user.tag}/g, member.user.tag)
            field.value = field.value.replace(/{user.inviter}/g, inviter)
            field.value = field.value.replace(/{user}/g, member.user.tag)
            field.value = field.value.replace(/{user.inviter.tag}/g, inviter.tag)
            field.value = field.value.replace(/{user.inviter.id}/g, inviter.id)
            field.value = field.value.replace(/{user.inviter.mention}/g, inviter.toString())
            field.value = field.value.replace(/{user.inviter.username}/g, inviter.username)
            field.value = field.value.replace(/{user.inviter.discriminator}/g, inviter.discriminator)
            field.value = field.value.replace(/{guild.name}/g, member.guild.name)
            field.value = field.value.replace(/{guild.id}/g, member.guild.id)
            field.value = field.value.replace(/{guild.memberCount}/g, member.guild.memberCount)
            field.value = field.value.replace(/{guild.createdAt}/g, member.guild.createdAt)
            field.value = field.value.replace(/{guild.createdTimestamp}/g, member.guild.createdTimestamp)
        })


   
    
    
    
        channel.send({embeds: [embed]})

    } 
    dataGuild.leaveSettings.leaveMessageEnabled = true
    if(dataGuild.leaveSettings.leaveMessageEnabled == true){
        if(dataGuild.leaveSettings.leaveChannel == null) return;
        dataGuild.leaveSettings.leaveChannel = "1087822177635672256"
        let channel = member.guild.channels.cache.get(dataGuild.leaveSettings.leaveChannel)
        if(!channel) return;
        
        let message = dataGuild.leaveSettings.leaveMessage
        message = "Bienvenue à {user.tag} (ID: {user.id}) ! Vous avez été invité par {user.inviter.tag} (ID: {user.inviter.id}).\n"
        message += "Votre compte a été créé le {user.createdAt} ({user.createdTimestamp}).\n"
        message += "Nom du serveur : {guild.name} (ID: {guild.id})\n"
        message += "Il y a actuellement {guild.memberCount} membres sur ce serveur.\n"
        message += "Merci de rejoindre notre communauté !"
        message = message.replace(/{user}/g, member.user.tag)
        message = message.replace(/{user.id}/g, member.user.id)
        message = message.replace(/\n/g, "\n")
        message = message.replace(/{user.mention}/g, member.user.toString())
        message = message.replace(/{user.username}/g, member.user.username)
        message = message.replace(/{user.discriminator}/g, member.user.discriminator)
        message = message.replace(/{user.avatar}/g, member.user.avatarURL())
        message = message.replace(/{user.bot}/g, member.user.bot)
        message = message.replace(/{user.createdAt}/g, member.user.createdAt)
        message = message.replace(/{user.createdTimestamp}/g, member.user.createdTimestamp)
        message = message.replace(/{user.tag}/g, member.user.tag)
        message = message.replace(/{user.inviter}/g, inviter)
        message = message.replace(/{user.inviter.tag}/g, inviter.tag)
        message = message.replace(/{user.inviter.id}/g, inviter.id)
        message = message.replace(/{user.inviter.mention}/g, inviter.toString())
        message = message.replace(/{user.inviter.username}/g, inviter.username)
        message = message.replace(/{user.inviter.discriminator}/g, inviter.discriminator)
        message = message.replace(/{guild.name}/g, member.guild.name)
        message = message.replace(/{guild.id}/g, member.guild.id)
        message = message.replace(/{guild.memberCount}/g, member.guild.memberCount)
        message = message.replace(/{guild.createdAt}/g, member.guild.createdAt)
        message = message.replace(/{guild.createdTimestamp}/g, member.guild.createdTimestamp)


        channel.send({content : message})

    }

    

    

}
)

