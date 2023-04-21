const pm2 = require("pm2");

module.exports = {
    name: "restart",
    description: "restart the bot",
    aliases: ["reboot"],

    run : async (client, message, args) => {
        if (!client.config.owners.includes(message.author.id)) return message.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande" }).catch(err => {});
        await message.reply({ content: "Redémarrage en cours..." }).catch(err => {});
        process.exit(1);
        
    }
}