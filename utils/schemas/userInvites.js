const {
    Schema,
    model
} = require("mongoose");

const invitesSchema = new Schema({
    userId: String,
    guildId: String,
    bonusInvites: String,
    invalidInvites: String,
    invited: Array,
    invitedLeft: Array,
    invites: Number,
})

module.exports = new model("userInvites", invitesSchema);