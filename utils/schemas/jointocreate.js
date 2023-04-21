const {
    Schema,
    model
} = require("mongoose");

const j2cSchema = new Schema({
    guildId: String,
    channelId: String,
    channelName: String,
    userLimit: String,
    muteByDefault: Boolean,
    deafByDefault: Boolean,
    permissions: {
        bl: Boolean,
        wl: Boolean,
        disconnect: Boolean,
        changeName: Boolean,
        muteAndDeaf: Boolean,
        changeUserLimit: Boolean
    }

  })

module.exports = new model("joinToCreate", j2cSchema);