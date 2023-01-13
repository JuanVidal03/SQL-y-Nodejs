// configuración express y socket.io
const express = require('express');
const app = express();
const PORT = 8080;
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// configuración handlebars
const handlebars = require('express-handlebars');
const hbs = handlebars.create({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts'
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

// options de conexión mariaDB
const { options } = require('./options/mariaDB.js');

// instanciaS de la clases products.js y messages.js
const Products = require('./Products.js');
const product = new Products(options ,'productos');

const Messages = require('./Messages.js');
const message = new Messages('messages.json');


// configuración de socket.io
io.on('connection', async socket => {
    console.log('Nuevo usuario conectado!');

    // enviando los productos al cliente
    const allProducts = await product.getAllProducts();
    socket.emit('products', allProducts );

    // escuchando los productos que envia el cliente
    socket.on('sendProduct', async data => {

        // subiendo productos a la DB
        await product.insertProducts(data);

        // enviando los productos actualzados
        io.sockets.emit('products', allProducts);
    });


    // enviando mensajes al cliente
    const allMessages = await message.getAllMessages();
    socket.emit('messages', allMessages);

    // escuchando los mensajes que envía el cliente
    socket.on('sendMessage', async data => {

        await message.saveMessages(data);
        io.sockets.emit('messages', allMessages);
    });
});


// ruta principal
app.get('/', async(req, res) => {

    try {
        // variable que almacena todos los productos
        let allProducts;

            await product.getAllProducts()
            .then(res => {
                allProducts = res;
                return allProducts;
            })
            .catch(err => {
                console.log(`Hubo un error al obtener los productos: ${err}.`);
            });

        // renderización de los productos
        res.render('mensajes', { products: allProducts });

    } catch (error) {
        res.json({ error: `Ha ocurrido un error: ${error}` });
    }
});


// eliminado producto por id
app.delete('/delete/:id', async (req, res) => {

    // obteniendo el id a eliminar
    const id = parseInt(req.params.id);

    try {
        await product.deleteProductById(id);
        res.send('Porduto eliminado con exito!');

    } catch (error) {
        
    }
});


// iniciando server y mapeando errores
const srv = server.listen(PORT, () => {
    console.log(`Servidor escuchando el puerto: ${srv.address().port}`);
});
srv.on('error', error => console.log(`Ocurrio un error en el servidor: ${error}`));