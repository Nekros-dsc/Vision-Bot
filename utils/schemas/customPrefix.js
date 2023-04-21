const {
    Schema,
    model
} = require("mongoose");

const prefixSchema = new Schema({
    guildId: String,
    prefix: String

  })

module.exports = new model("customPrefix", prefixSchema);