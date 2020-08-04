const { Sequelize, DataTypes } = require('sequelize');

const serversql = new Sequelize('server_tabelle', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'server.sqlite',
});

const localsql = new Sequelize('local_user', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'local_user.sqlite',
});


const globalsql = new Sequelize('Global_User', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'global_user.sqlite',
});

const Global_User = globalsql.define('Global_User', {
    user_id: {
        type: DataTypes.TEXT,
        primaryKey: true,
        unique: true
    },
    xp: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    coins: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
});

const Server = serversql.define('server_tabelle', {
    guild_id: {
        type: DataTypes.TEXT,
        primaryKey: true,
        unique: true
    },
    prefix: {
        type: DataTypes.TEXT,
        defaultValue: "+"
    },





    team_role: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    mute_role: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
  join_role: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
   xp: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    xp_msg: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    xp_ch: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },




    wlc: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    wlc_msg: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    wlc_ch: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },


    gb: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    gb_msg: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    gb_ch: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    
});



const Local_User = localsql.define('local_user', {
    user_id: {
        type: DataTypes.TEXT,
        primaryKey: true,
        unique: true
    },
    guild_id: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    warn_i: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    warn_ii: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    warn_iii: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    
});

const sync = async () => {
    await serversql.sync();
    console.log(' > ServerSQL Synced');
    await localsql.sync();
    console.log(' > LocallSQL Synced');
    await globalsql.sync();
    console.log(' > GlobalSQL Synced');
}

sync();

module.exports = {Server, Local_User, Global_User}