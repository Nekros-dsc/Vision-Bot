//
const {
    Schema,
    model
} = require('mongoose');

const guildSetupSchema = new Schema({
    guildId : String,
    joinSettings : {
        joinChannel : String,
        joinMessage : String,
        joinMessageEnabled : Boolean,
        joinDm : String,
        joinDmEnabled : Boolean,
        joinRole : String,
        joinRoleEnabled : Boolean,
        joinEmbed : String,
        vanityMessage : String,
        joinEmbedEnabled : Boolean,

    },
    leaveSettings : {
        leaveChannel : String,
        leaveMessage : String,
        leaveMessageEnabled : Boolean,
        leaveDm : String,
        vanityMessage : String,
        leaveDmEnabled : Boolean,
        leaveEmbed : String,
        leaveEmbedEnabled : Boolean,
    },
});

module.exports = model('guildSetup', guildSetupSchema);
   