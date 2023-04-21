const client = require("../../index");
const prefixSchema = require("../../utils/schemas/customPrefix");

client.on("messageCreate", async (message) => {
  message.channel.members

  if (!message.content) return;

  if(message.member.user.username.includes("zaawa")) {
    message.delete()
    .then(() => {
      message.channel.send(`<@${message.author.id}> t mute heheh :heart:`)
    })
  }

  let prefix = await prefixSchema.findOne({ guildId: message.guild.id }).prefix || client.config.defaultPrefix;
  console.log(prefix)
  
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention)) return message.reply({ content: "Mon prefix sur ce serveur est `" + prefix + "` "}).catch(err => {});

  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  if (message.channel.type == 1) return;
  
  const [cmd, ...args] = message.content 
  .slice(prefix.length)
  .trim()
  .split(/ +/g);

  const command = client.commands.get(cmd.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()))
   
  if (!command) return;
  if(!client.config.owners.includes(message.author.id)) return;
  command.run(client, message, args);
});
