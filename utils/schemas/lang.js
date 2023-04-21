//lang model we have french and english 
//
const {
    Schema,
    model
} = require("mongoose");

const langSchema = new Schema({
    guildId: String,
    lang: String
})

module.exports = new model("lang", langSchema);