//mongodb schema with mongoose with an array OF WL USERS

const {
    Schema,
    model
} = require("mongoose");

const wlSchema = new Schema({
    guildId: String,
    wlUsers: Array
})


module.exports = new model("wl", wlSchema);