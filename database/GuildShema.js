const mongoose = require('mongoose')

const GuildShema = new mongoose.Schema({
    guildID: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    prefix: {
        type: mongoose.SchemaTypes.String,
        default: '-'
    },
    levelMessage: {
        type: mongoose.SchemaTypes.Boolean,
        default: false
    }
})

module.exports = mongoose.model('GuildConfig', GuildShema)