//userId /and embeds thats is an array 

const {
    Schema,
    model
} = require("mongoose");

const embedSchema = new Schema({
    guildId: String,
    embeds: [],
    count : Number
})

module.exports = new model("embedSave", embedSchema);