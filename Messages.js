// requiriendo modulo fs
const fs = require('fs');

// incio de la clase
class Messages{
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
}

// exportando la clase para usarla el server.js
module.exports = Messages;