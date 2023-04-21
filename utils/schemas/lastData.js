const 
{
    Schema,
    model

} = require('mongoose');

const lastData = new Schema({
    userId : String,
    guildId : String,
    inviterId : String,
});

module.exports = model('lastData', lastData);