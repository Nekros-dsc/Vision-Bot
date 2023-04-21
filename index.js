const {Client, Collection,EmbedBuilder} = require('discord.js');
const config = require('./config.json');
 const client = new Client({
    intents : [
        3276799
    ],
    partials : 
    [
        "CHANNEL",
        "GUILD_MEMBER",
        "MESSAGE",
        "REACTION",
    ],
});
//c niquel ?// jere 
const { translator } = require("./translator/index");
const lang = require('./utils/schemas/lang');

client.config = config;
client.emoji = require('./emojis.json');
client.translator = translator;

client.commands = new Collection();

client.getLang = async (guildId) => {
  lang.findOne({ guildId: guildId }, async (err, data) => {
    if (err) throw err;
    if (data) {
      return data.lang;
    } else {
      return "en";
    }
  });
};



client.guildInvites = new Map();
client.awaitReply = (message, question, limit = 60000, langue) => {
    const filter = m => m.author.id === message.author.id;
    
    return new Promise(async (resolve, reject) => {
      let msg = await message.reply({embeds : [new EmbedBuilder().setDescription(question).setColor(client.config.defaultColor)]});
      try {
        const collected = await message.channel.awaitMessages({ filter, max: 1, time: limit, errors: ["time"] });
        await msg.delete().catch(e => {});
        await collected.first().delete().catch(e => {});
        resolve(collected.first());
      } catch (e) {
        await msg.delete().catch(e => {});
        await message.reply({embeds : [new EmbedBuilder().setDescription((await client.translator("<:time:1088408381569630259> Le temps de **1m** s'est écoulé !", {to : langue})).text).setColor(client.config.defaultColor)]}).then(msg => {
            setTimeout(async () => {
              await   msg.delete().catch(e => {})
            }, 5750);
        })
        resolve(false);
      }
    });
  };

client.embed = (message,description,boolean) =>{
 let embed =    new EmbedBuilder()
    .setDescription(description)
    .setColor(client.config.defaultColor)
 message.reply({embeds : [embed],ephemeral : boolean}).then(msg => {
     setTimeout(() => {
            msg.delete().catch(e => {})
        }, 3000);
    })

}
module.exports = client;

require('./handler/handler')(client);
require('./handler/anticrash')(client);

client.login(config.token);

client.on("messageCreate", async(message) => {
    if(message.content.toLowerCase().includes("negro")) return message.reply("Nique les noirs") ;
});

