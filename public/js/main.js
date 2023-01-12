// iniciando socket
const socket = io.connect();

/*================
PRODUCTOS
// verificando si hay productos y renderizarlos en el html
================*/

// verificar si hay productos que se pueda renderizar en el html
const renderizarContenido = data => {

    if (data.length > 0) {
        let html =`
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Precio</th>
                        <th scope="col">Miniatura</th>
                    </tr>
                </thead>
                <tbody>

                ${data.map(product => {
                    return(`
                        <tr>
                            <td scope="row">${product.nombre}</th>
                            <td>$${product.precio}</td>
                            <td><img src=${product.thumbnail} alt=${product.nombre} style="width:50px; height:50px; object-fill:cover" /> </td>
                        </tr>
                    `)
                }).join(" ")}
                
                </tbody>
            </table>
            </div>
        </div>
        `
        // rederizo la tabla en la vista
        document.getElementById('renderProducts').innerHTML = html;

    } else{
        let html =`
            <div class="no-products">
                <p>No hay productos disponibles.</p>
            </div>
        `
        // rederizo la tabla en la vista
        document.getElementById('renderProducts').innerHTML = html;
    }

};

// escuchando el servidor y renderizando los productos
socket.on('products', data => {
    renderizarContenido(data);
});


// enviando productos al server
const sendProduct = (e) => {

    // cuerpo del mensaje
    let bodyProduct = {
        nombre: document.getElementById('nombre').value,
        precio: document.getElementById('precio').value,
        thumbnail: document.getElementById('thumbnail').value
    }

    // enviando mensaje al server
    socket.emit('sendProduct', bodyProduct);

    // vaciando los campos
    document.getElementById('nombre').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('thumbnail').value = '';

    return false;
};


/*================
MENSAJES
// verificando si hay mensajes y renderizarlos en el html
================*/

// funcion que renderiza los mensajes
const renderizarMessages = (data) => {

    if (data.length > 0) {

        let html = `

            ${data.map(mes => {

                return(`
                    <div class="messages-container">
                        <b class="messages-author">${mes.email}</b>
                        <p class="messages-date">[${mes.date}]:</p>
                        <em class="messages-text">${mes.text}</em>
                    </div>
                `);
            }).join(" ")}
        `;

        // rederizo los mensajes en la vista
        document.getElementById('renderMensajes').innerHTML = html;

    } else {

        let html =`
            <div class="no-products">
                <h3>No hay mensajes disponibles.</h3> 
            </div>
        `
        // rederizo el texto en la vista
        document.getElementById('renderMensajes').innerHTML = html;

    }
}

// escuchando los mensajes del servidor
socket.on('messages', data => {
    renderizarMessages(data)
});


// enviando los mensajes al servidor
const sendMessages = (e) => {

    // cuerpo del mensaje
    let bodyMessage = {
        email: document.getElementById('email').value,
        text: document.getElementById('text').value,
    }

    // enviando mensaje al server
    socket.emit('sendMessage', bodyMessage);

    // vaciando los campos
    document.getElementById('email').value = '';
    document.getElementById('text').value = '';

    return false;
}
