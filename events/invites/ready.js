const client = require("../../index")
const {generateInvitesCache}  = require("../../utils/functions/invites")
client.on("ready", async ()=> { 
    const invites = {};
    client.fetching = true; 
    
    await client.guilds.cache.forEach( async (guild) => {
        
     
            let fetchedInvites = null;
                await guild.invites.fetch().catch(() => {});
                fetchedInvites = generateInvitesCache(guild.invites.cache);
            invites[guild.id] = fetchedInvites;
        
    });
    client.invitations = invites;
       
    });
