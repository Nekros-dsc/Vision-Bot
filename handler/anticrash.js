const {  EmbedBuilder, WebhookClient } = require("discord.js");
const procces = require("process");

module.exports =  (client) => {

    const webhook = new WebhookClient({ url: 'https://discord.com/api/webhooks/1087826126749048862/kpRuDgtD5cjrAIYYgjM50J79V7kEhHwZjgXqNjnNObCADFBnaxy9POrpD8RFfIT5Yqg-' });

    const temeplateEmbed = new EmbedBuilder()
    .setColor("#2f3136")
    client.on("error", (err) => {
        console.log(' [antiCrash] :: Error');
        console.log(err);
        return webhook.send({ embeds: [temeplateEmbed.setDescription("```" + "Erreur guetto" + "```")]}).catch(err => {})
    });

    process.on('unhandledRejection', (reason, p) => {
         console.log(' [antiCrash] :: Unhandled Rejection/Catch');
         console.log(reason, p);
         return webhook.send({ embeds: [temeplateEmbed.setDescription("```" + (reason + p).slice(0, 2042) + "```")]}).catch(err => {})
     });
     //TypeError: (reason , p).slice is not a function
        process.on("uncaughtException", (err, origin) => {
            console.log(' [antiCrash] :: Uncaught Exception/Catch');
            console.log(err, origin);
         return webhook.send({ embeds: [temeplateEmbed.setDescription("```" + (err + origin).slice(0, 2042) + "```")]}).catch(err => {})
         });
        procces.on("typeError", (err, origin) => {
            console.log(' [antiCrash] :: Type Error');
            console.log(err, origin);
        return webhook.send({ embeds: [temeplateEmbed.setDescription("```" + (err + origin).slice(0, 2042) + "```")]}).catch(err => {})
        });
        //good ?

  

 }
