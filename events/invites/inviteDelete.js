const client = require("../../index")
const inviteCreateSchema = require("../../utils/schemas/inviteCreate");

client.on("inviteDelete", async (invite) => {
    if (!client.fetched) return;
    if (!client.invitations[invite.guild.id]) return;
    // Add the invite to the cache
   client.invitations[invite.guild.id].delete(invite.code);

   
   
});