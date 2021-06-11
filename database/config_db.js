const user = require('../entities/user-model');
const typeorm = require('typeorm');
const EntitySchema = typeorm.EntitySchema;

require('dotenv').config();

const connectionOpt = {
    "type": "mysql", 
    "host": "localhost", 
    "port": 3306, 
    "username": "root", 
    "password": process.env.DB_PASSWORD, 
    "database": process.env.DB_NAME,
    "synchronize": true, 
    "logging": false, 
    entities: [ 
        new EntitySchema(require('../entities/user.json')) 
    ]
}

module.exports = connectionOpt;