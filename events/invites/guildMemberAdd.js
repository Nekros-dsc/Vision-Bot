const { EmbedBuilder } = require("@discordjs/builders");
const client = require("../../index");
const invitesSchema = require("../../utils/schemas/userInvites")
const lastData = require("../../utils/schemas/lastData")

const { generateInvitesCache,isEqual } = require("../../utils/functions/invites");

client.on("guildMemberAdd", async (member) => {

    let invite = null;
    let vanity = false;
    let isFake = false;

  
    await member.guild.invites.fetch().catch(() => {});
    const guildInvites = generateInvitesCache(member.guild.invites.cache);
  
    const oldGuildInvites = client.invitations[member.guild.id];
    if (guildInvites && oldGuildInvites){
     
        client.invitations[member.guild.id] = guildInvites;
       
        let inviteUsed = guildInvites.find((i) => oldGuildInvites.get(i.code) && ((Object.prototype.hasOwnProperty.call(oldGuildInvites.get(i.code), "uses") ? oldGuildInvites.get(i.code).uses : "Infinite") < i.uses));
        if ((isEqual(oldGuildInvites.map((i) => `${i.code}|${i.uses}` ).sort(), guildInvites.map((i) => `${i.code}|${i.uses}` ).sort())) && !inviteUsed && member.guild.features.includes("VANITY_URL")){
            vanity = true;
        } else if (!inviteUsed){
            const newAndUsed = guildInvites.filter((i) => !oldGuildInvites.get(i.code) && i.uses === 1);
            if (newAndUsed.size === 1){
                inviteUsed = newAndUsed.first();
            }
        }
        if (inviteUsed && !vanity) invite = inviteUsed;
    } else if (guildInvites && !oldGuildInvites) {
       client.invitations[member.guild.id] = guildInvites;
    }
    if (!invite && guildInvites){
        const targetInvite = guildInvites.some((i) => i.targetUser && (i.targetUser.id === member.id));
        if (targetInvite.uses === 1) {
            invite = targetInvite;
        }
    }
    


    let inviter = invite ? invite.inviter : null;
    if(vanity) inviter = 'Vanity';
    if(member.id == inviter.id) isFake = true;
    //check if the account is older than 7 days if its not then its fake
    if(!isFake){
        const date = new Date(member.user.createdTimestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if(days < 7) isFake = true;
    }

    if (inviter && inviter !== 'Vanity' ){
        //add him an invite 
        /**
           userId: String,
    guildId: String,
    bonusInvites: String,
    invalidInvites: String,
    invited: Array,
    invitedLeft: Array,
    invites: Number, */
        const data = await invitesSchema.findOne({guildID: member.guild.id, userID: inviter.id});
        console.log(data)
        if(!data){
            if(isFake){
                await new invitesSchema({
                    guildId: member.guild.id,
                    userId: inviter.id,
                    bonusInvites: 0,
                    invalidInvites: 1,
                    invited: [member.id],
                    invitedLeft: [],
                    invites: 0,
                }).save();
            } else {
                await new invitesSchema({
                    guildId: member.guild.id,
                    userId: inviter.id,
                    bonusInvites: 0,
                    invalidInvites: 0,
                    invited: [member.id],
                    invitedLeft: [],
                    invites: 1,
                }).save();
            }
          
        } else {
            if(isFake){
                data.invalidInvites = data.invalidInvites + 1;
                data.invited.push(member.id);
            } else {
                data.invites = data.invites + 1;
                data.invited.push(member.id);
            }
            data.save();
        }
        lastData.findOne({guildId: member.guild.id, userId: member.id}, async (err, data) => {
            if(err) throw err;
            if(data){
                data.inviterId = inviter.id;
                data.save();
            } else {
                await new lastData({
                    guildId: member.guild.id,
                    userId: member.id,
                    inviterId: inviter.id,
                }).save();
            }
        })
        
    }
   //tempo
    client.channels.cache.get("1087822177635672256").send({embeds: [new EmbedBuilder().setTitle("Member Joined").setDescription(`**Member:** ${member.user.tag} (${member.id})\n**Inviter:** ${inviter ? `${inviter.tag} (${inviter.id})` : "Unknown"}\n**Vanity:** ${vanity ? "Yes" : "No"}`).setTimestamp()]});


    //CC
  

   
    

    
});
