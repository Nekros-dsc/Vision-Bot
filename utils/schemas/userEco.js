const {
    Schema,
    model
} = require("mongoose");

const userEcoSchema = new Schema({
    userId: String,
    guildId: String,
    balance: String,
    lastTransactions: Array
  })

module.exports = new model("userEco", userEcoSchema);