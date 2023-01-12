const options ={
    client: 'mysql',
    connection: {
        host: 'localost',
        user: 'root',
        password: '',
        database: 'ecommerce-sql-ynodejs'
    },
    pool: { min: 0, max: 10 }
}


module.exports = options;



/*
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localost',
        user: 'root',
        password: '',
        database: 'ecommerce-sql-ynodejs'
    },
    pool: { min: 0, max: 10 }
})

module.exports = knex;
*/