const fs = require('fs');
const { knex } = require('knex');

//inicio de la clase
class Products {

    // setup de configuracion y nombre de la tabla dada por el usuario
    constructor(config, tableName){
        this.knex = knex(config);
        this.tableName = tableName;
    }

    // creando una tabla
    async crearTabla(){
        return await this.knex.schema.dropTableIfExists(this.tableName)
            .finally(async () => {
                return await this.knex.schema.createTable(this.tableName, table => {
                    table.increments('id').primary();
                    table.string('nombre', 20).notNullable();
                    table.integer('precio').notNullable();
                    table.string('thumbnail').notNullable();
                })
            })
    }

    // insertando productos
    async insertProducts(productos){
        return await this.knex(this.tableName).insert(productos);
    }

    // obteniendo los productos
    async getAllProducts(){
        return await this.knex(this.tableName).select('*');
    }

    // eliminar productos por id
    async deleteProductById(id){
        return await this.knex.from(this.tableName).where('id', id).del();
    }

    // terminar el proceso
    async close(){
        return await this.knex.destroy();
    }

}

// exportando la clase para usarlo en server.js
module.exports = Products;