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

// options de conexión DB
const options = require('./options/mariaDB.js');

// instanciaS de la clases products.js y messages.js
const Products = require('./Products.js');
const product = new Products(options ,'productos');

const Messages = require('./Messages.js');
const message = new Messages('messages.json');


// configuración de socket.io
io.on('connection', async socket => {
    console.log('Nuevo usuario conectado!');

    // enviando los productos al cliente
    const allProducts = await product.getAll();
    socket.emit('products', allProducts );

    // escuchando los productos que envia el cliente
    socket.on('sendProduct', async data => {

        // subiendo datos a fs
        await product.save(data);
        // enviando los productos actualziados
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
        const allProducts = await product.getAll();
        res.render('mensajes', { products: allProducts });
    } catch (error) {
        res.json({ error: `Ha ocurrido un error: ${error}` });
    }
});


// iniciando server y mapeando errores
const srv = server.listen(PORT, () => {
    console.log(`Servidor escuchando el puerto: ${srv.address().port}`);
});
srv.on('error', error => console.log(`Ocurrio un error en el servidor: ${error}`));