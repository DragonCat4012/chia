const { Sequelize, DataTypes } = require('sequelize');

const monstersql = new Sequelize('monster', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'monster.sqlite',
});

const Dungeons = monstersql.define('dungeons', {
    DID: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    NAME: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    rare: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    line: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    dropcoin: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    droprate: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
});