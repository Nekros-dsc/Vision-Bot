const {
    Schema,
    model
} = require("mongoose");

const newInviteSchema = new Schema({
    guildId: String,
    data : Array
})

module.exports = new model("newInvite", newInviteSchema);

