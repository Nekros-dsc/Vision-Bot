const j2cSchema = require("../../utils/schemas/jointocreate");
const j2cCreate = require("../../utils/schemas/jtcChannel");
const client = require("../../index");

client.on('voiceStateUpdate', async (oldState, newState) => {

    // Si l'utilisateur quitte un salon vocal
    if (oldState.channel && oldState.channel.members.size == 0) {
        const j2c = await j2cCreate.findOne({ channelId: oldState.channel.id });
        if (j2c) {
            oldState.channel.delete().catch(() => {});
            j2c.deleteOne().catch(() => {});
        }
    }

    // Si l'utilisateur rejoint un salon vocal
    if (newState.channel) {
        const j2c = await j2cSchema.findOne({ guildId: newState.guild.id });
        if (j2c && j2c.channelId == newState.channel.id) {
            try {
                const newChannel = await newState.channel.clone({
                    name: (j2c.channelName || newState.member.user.username ).replace("[username]", newState.member.user.username),
                    topic: newState.member.id,
                    userLimit: j2c.userLimit || 0
                });
                await newState.member.voice.setChannel(newChannel);
                const newJ2c = new j2cCreate({
                    channelId: newChannel.id,
                    authorId: newState.member.user.id,
                });
                await newJ2c.save();
            } catch (err) {}
        } else {
            const chan = await j2cCreate.findOne({ channelId: newState.channel.id });
            if (chan && j2c && j2c.authorId != newState.member.user.id) {
                if(newState.channel.topic == newState.member.id) return;
                newState.member.voice.setMute(j2c.muteByDefault).catch(() => {});
                newState.member.voice.setDeaf(j2c.deafByDefault).catch(() => {});
            }
        }
    }
});


