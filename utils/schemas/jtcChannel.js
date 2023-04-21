const {
    Schema,
    model
} = require("mongoose");

const j2cCreate = new Schema({
    channelId: String,
    authorId: String
  })

module.exports = new model("j2c", j2cCreate);