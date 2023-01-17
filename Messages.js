// requiriendo modulo fs
const { knex } = require('knex');

// incio de la clase
class Messages{

    /*
    constructor(path){
        this.path = path;
    }

    // metodo que obtiene todos mensajes
    async getAllMessages(){

        try {

            const obj = await fs.promises.readFile(`${this.path}`, 'utf-8', err => {
                if (err) {
                    console.log(err);
                }
            });
            return JSON.parse(obj);

        } catch (error) {
            console.log(`ERROR: ${error}`);
            return [];
        }
    }

    // metodo para guardar mensajes
    async saveMessages(object){

        // obtenemos todos lo mensajes y asignamos una fecha al mensaje
        const objects = await this.getAllMessages();
        let date = new Date().toLocaleString();
        let newObject = {...object, date: date}

        objects.push(newObject);

        try {
            await fs.promises.writeFile(`${this.path}`, JSON.stringify(objects, null, 2));
        } catch (error) {
            console.log(`ERROR: ${error}`);
        }
    }
    */

    constructor(config, tableName){
        this.knex = knex(config);
        this.tableName = tableName;
    }

    // creando tabla
    async crearTable(){
        return await this.knex.schema.dropTableIfExists(this.tableName)
            .finally(async () => {
                return await this.knex.schema.createTable(this.tableName, table => {
                    table.increments('id').primary();
                    table.string('email').notNullable();
                    table.string('text').notNullable();
                    table.timestamp('date').defaultTo(this.knex.fn.now());
                    // table.datetime('date').defaultTo( this.knex.fn.now());
                })
            })
    }

    // insertar mensajes
    async insertMessages(message){
        return await this.knex(this.tableName).insert(message);
    }

    // listar messages
    async getAllMessages(){
        return await this.knex(this.tableName).select('*');
    }

    // borrar mensaje por id
    async deleteMessageById(id){
        return await this.knex.from(this.tableName).where('id', id).del();
    }

    // terminar proceso
    async close(){
        return await this.knex.destroy();
    }
}

// exportando la clase para usarla el server.js
module.exports = Messages;