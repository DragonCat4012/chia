const mongoose = require('mongoose')

const UserShema = new mongoose.Schema({
    userID: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    stamina: {
        type: mongoose.SchemaTypes.Integer,
        default: 40
    },
    xp: {
        type: mongoose.SchemaTypes.Integer,
        default: 0
    },
    healthPoints: {
        type: mongoose.SchemaTypes.Integer,
        default: 25
    },
    weapon: {
        type: mongoose.SchemaTypes.String,
    },
    shield: {
        type: mongoose.SchemaTypes.String
    },
    dungeon: {
        type: mongoose.SchemaTypes.Integer,
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