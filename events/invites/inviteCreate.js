const inviteCreateSchema = require("../../utils/schemas/inviteCreate");
const { MessageEmbed } = require("discord.js");

const { inviteToJson } = require("../../utils/functions/invites");

const client = require("../../index")
client.on("inviteCreate",async (invite) => {
    if (!client.fetched) return;
    if (!client.invitations[invite.guild.id]) return;
    client.invitations[invite.guild.id].set(invite.code, inviteToJson(invite));
   
});