const { ComponentType, ButtonStyle } = require("discord-api-types/v9");
const wlSchema = require("../schemas/wl");
const langSchema = require("../schemas/lang");
const client = require("../../index");

async  function updateWl(message, page, itemsPerPage, components){
  
    let data = await wlSchema.findOne({ guildId: message.guild.id }) || { wlUsers: [] };
    
    const lang = await langSchema.findOne({ guildId: message.guild.id }).lang || "en";


    let pages = Math.max(Math.ceil(data.wlUsers.length / itemsPerPage), 1);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage; //je men occupe tkt fais la suite
    const itemsToShow =  data.wlUsers.slice(startIndex, endIndex);

    const rowOfButtons = {
      type : ComponentType.ActionRow,
      components : [
        {
          type : ComponentType.Button,
          customID : 'leftIn' + message.id,
          emoji : {
            name : client.emoji.left.split(":")[1],
            id : client.emoji.left.split(":")[2].replace(">", "")
          },
          style : ButtonStyle.Secondary,
          disabled: page === 1 // Disable the button if we're already on the first page
        },
        {
          type : ComponentType.Button,
          customID : 'add' + message.id,
          emoji : {
            name : client.emoji.add.split(":")[1],
            id : client.emoji.add.split(":")[2].replace(">", "")
          },
          style : ButtonStyle.Secondary
        },
        {
          type : ComponentType.Button,
          customID : 'remove' + message.id,
          emoji : {
            name : client.emoji.remove.split(":")[1],
            id : client.emoji.remove.split(":")[2].replace(">", "")
          },
          style : ButtonStyle.Secondary,
          disabled : data.wlUsers.length == 0
        },
      
        {
          type : ComponentType.Button,
          customID : 'nextIn' + message.id,
          emoji : {
            name : client.emoji.right.split(":")[1],
            id : client.emoji.right.split(":")[2].replace(">", "")
          },
          style : ButtonStyle.Secondary,
          disabled: page === pages // Disable the button if we're already on the last page
        }
      ]
    }
  let rowOfButtons2 = {
    type : ComponentType.ActionRow,
    components : [

        {
            type : ComponentType.Button,
            customID : 'page' + message.id,
            label : `Page ${page}/${pages}`,
            style : ButtonStyle.Secondary,
            disabled : true
        } ,   {
          type : ComponentType.Button,
          customID : 'no_includes' + message.id,
          emoji : {
            name : client.emoji.no.split(":")[1],
            id : client.emoji.no.split(":")[2].replace(">", "")
          },
          style : ButtonStyle.Secondary,
        }
        ]
      }
  //gonna add one field to the embed 
  if(message.embeds[0] == null) message.embeds[0] = {}

  if(message.embeds[0].fields?.length == 1){
  message.embeds[0].fields.push({
    name: `・${(await client.translator("Utilisateur(s) Whitelist",{to : lang})).text}  (${data.wlUsers.length})`,
    value: `\`\`\`lua\n${itemsToShow.map(r => {
      return `${client.users.get(r).username} (ID: ${r})`;
    }).join("\n") || "Aucun"}\n\`\`\``,
  });
} 
if(!message.embeds[0].fields) {
  message.embeds[0].fields = [{
    name: `・${(await client.translator("Utilisateur(s) Whitelist",{to : lang})).text}  (${data.wlUsers.length})`,
    value: `\`\`\`lua\n${itemsToShow.map(r => {
      return `${client.users.get(r).username} (ID: ${r})`;
    }
    ).join("\n") || (await client.translator("Aucun",{ to : lang})).text}\n\`\`\``,
  }]
  
}

else {
  message.embeds[0].fields[1].name = `・${await client.translator("Utilisateur(s) Whitelist",{to : lang}).text} (${data.wlUsers.length})`
  message.embeds[0].fields[1].value = `\`\`\`lua\n${itemsToShow.map(r => {
    return `${client.users.get(r).username} (ID: ${r})`;
  }).join("\n") || (await client.translator("Aucun",{ to : lang})).text}\n\`\`\``
}



    if(components){
      components[1].components[0].label = `Page ${page}/${pages}`
     components[1].components[3].disabled = page === 1
     components[1].components[4].disabled = page === pages
      message.edit({embeds : [message.embeds[0]], components : components})
    } else {
    
   message.edit({content : "",embeds : [message.embeds[0]], components : [rowOfButtons, rowOfButtons2]})}
  }

module.exports = {updateWl};