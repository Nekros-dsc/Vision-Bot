const {
    Schema,
    model
} = require("mongoose");

const ecoSchema = new Schema({
    guildId: String,
    customCurrency: String
  })

module.exports = new model("serverEco", ecoSchema);