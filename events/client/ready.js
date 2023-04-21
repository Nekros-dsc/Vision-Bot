const client = require("../../index");
const { ActivityType, EmbedBuilder } = require("discord.js");
const emojis = require("../../emojis.json");
const fs = require("fs");
const { WebhookClient } = require("discord.js");
const webhook = new WebhookClient({ url: 'https://discord.com/api/webhooks/1087826126749048862/kpRuDgtD5cjrAIYYgjM50J79V7kEhHwZjgXqNjnNObCADFBnaxy9POrpD8RFfIT5Yqg-' });
    
const temeplateEmbed = new EmbedBuilder()
  .setColor("#2f3136")


client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  webhook.send({embeds: [temeplateEmbed.setDescription("Je suis en ligne wewe")]})

setInterval(() => {

  client.user.setPresence({
    activities: [
      {
        name: `discord.gg/novaworld`,
        url: "https://twitch.tv/nekros_95",
        type: ActivityType.Streaming,
      },
    ],
    status: "idle",
  });

}, 30000)
  //gonna get the emojis.json and sort them by alphabetical order

  const sorted = Object.keys(emojis).sort((a, b) => a.localeCompare(b));

  //   now we need to create a new object with the sorted emojis

  const sortedEmojis = {};
  for (const key of sorted) {
    sortedEmojis[key] = emojis[key];
  }
  //   now we need to write the new object to the emojis.json file
  fs.writeFile(
    "./emojis.json",
    JSON.stringify(sortedEmojis, null, 4),
    (err) => {
      if (err) throw err;
      console.log("Successfully sorted emojis.json");
    }
  );
});
