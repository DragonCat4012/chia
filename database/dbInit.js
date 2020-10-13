const { Sequelize, DataTypes } = require('sequelize');

const monstersql = new Sequelize('monster', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'monster.sqlite',
});

const itemsql = new Sequelize('items', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'items.sqlite',
});

const spielersql = new Sequelize('spieler', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'spieler.sqlite',
});

const ordersql = new Sequelize('order', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'order.sqlite',
});



const Spieler = spielersql.define('spieler', {
    UID: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    XP: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    HP: {
        type: DataTypes.INTEGER,
        defaultValue: 25
    },
    RANK: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    COINS: {
        type: DataTypes.INTEGER,
        defaultValue: 20
    },
    PERK: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    WEAPON: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    SHIELD: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    ARROWS: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },

});


const Items = itemsql.define('items', {
    IID: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    NAME: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    TYPE: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    RARE: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    SALE: {
        type: DataTypes.TEXT,
        defaultValue: 1
    },
    USES: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    DEV: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    ATK: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    VALUE: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },

});

const Monster = monstersql.define('monster', {
    MID: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    NAME: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    RARE: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    DEV: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    ATK: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },

    DROPCOIN: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    DROPRATE: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    HP: {
        type: DataTypes.INTEGER,
        defaultValue: 10
    },

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
    RARE: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    LINE: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    DROPCOIN: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    DROPRATE: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
});

const Order = ordersql.define('order', {
    UID: {
        type: DataTypes.TEXT,
    },
    IID: {
        type: DataTypes.TEXT,
    },
});




const syncDatabase = async() => {
    try {
        await spielersql.sync();
        console.log(' > 🗸 Player loaded');
        await itemsql.sync();
        console.log(' > 🗸 Items loaded');
        await monstersql.sync();
        console.log(' > 🗸 Monsters & Dungeons loaded');
        await ordersql.sync();
        console.log(' > 🗸 Syncronisation Loaded')
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

module.exports = { Spieler, Monster, Items, Order, Dungeons, syncDatabase }