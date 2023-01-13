const fs = require('fs');
const { knex } = require('knex');

//inicio de la clase
class Products {

    /*
    constructor(path){
        this.path = path;
    }

    // metodo para obtener todos los productos
    async getAll(){
        try {
            
            const objs = await fs.promises.readFile(`${this.path}`, 'utf-8', err => {
                if(err){
                    console.log(err);
                }
            });
            return JSON.parse(objs);


        } catch (err) {
            console.log(`ERROR: ${err}`);
            return [];
        }
    }

    // guardando los productos
    async save(objeto){

        const objects = await this.getAll();
        let newId;

        // con esto se define el id que el elemento va a tener
        if (objects.length == 0) {
            newId = 1
        } else {
            newId = objects[objects.length-1].id+1;
        }

        // creamos el objeto definitivo y lo pusheamos al array contenedor
        const newObject = {...objeto, id: newId};
        objects.push(newObject);

        try{
            await fs.promises.writeFile(`${this.path}`, JSON.stringify(objects, null, 2));
            console.log('Producto añadido exitosamente!');
            // return newId;

        } catch(err) {
            throw new Error(`Errar al guardar: ${err}`)
        }
    }
    */

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