const mongoose = require('mongoose')

const UserShema = new mongoose.Schema({
    userID: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    stamina: {
        type: mongoose.SchemaTypes.Number,
        default: 40
    },
    xp: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    coins: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    rank: {
        type: mongoose.SchemaTypes.Number,
        default: 10
    },
    healthPoints: {
        type: mongoose.SchemaTypes.Number,
        default: 25
    },
    weapon: {
        type: mongoose.SchemaTypes.String,
    },
    shield: {
        type: mongoose.SchemaTypes.String
    },
    dungeon: {
        type: mongoose.SchemaTypes.Number,
        default: 1
    },
    daily: {
        type: mongoose.SchemaTypes.String,
    },
    weekly: {
        type: mongoose.SchemaTypes.String,
    },
    items: {
        type: mongoose.SchemaTypes.Array,
    }
})

module.exports = mongoose.model('UserConfig', UserShema)