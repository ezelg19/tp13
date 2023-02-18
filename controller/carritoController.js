require('dotenv').config()
const { productos } = require("../Daos(persistencia)/productoDao")
const { authors } = require('../Daos(persistencia)/authorDao.js')
const Mail = require("../utils/nodemailer")

const getCarrito = async (req, res) => {
    const usuario = req.user
    const produc = []
    const user = await authors.getByUser(usuario)
    for (let i = 0; i < user.carrito.length; i++) {
        const algo = await productos.getById(user.carrito[i])
        produc.push(algo[0])
    }

    res.render('lista', {
        productsExist: produc.length,
        products: produc
    })
}

const postCarrito = async (req, res) => {
    const usuario = await authors.getByUser(req.user)
    const idProducto = req.params.idProducto
    usuario.carrito.push(parseInt(idProducto))
    await authors.actualizar(usuario)
    res.json({ a: `producto ${await productos.getById(idProducto)}` })
}

const deleteProducto = async (req, res) => {
    const usuario = req.user
    const produc = []
    const idProducto = parseInt(req.params.idProducto)
    const user = await authors.getByUser(usuario)
    for (let i = 0; i < user.carrito.length; i++) {
        if (user.carrito[i] != idProducto) {
            produc.push(idProducto)
        }
    }
    user.carrito = produc
    await authors.actualizar(user)
}

const deleteCarrito = async (req, res) => {
    const usuario = req.user
    usuario.carrito = []
    await authors.actualizar(usuario)
}

const finCompra = async (req, res) => {
    console.log('finCompra')
    const usuario = req.user
    const produc = []
    const user = await authors.getByUser(usuario)
    for (let i = 0; i < user.carrito.length; i++) {
        const algo = await productos.getById(user.carrito[i])
        produc.push(algo[0])
    }
    const html = `<table id='table' style='border-collapse: collapse;''> 
                    <thead class='thead-dark'>      
                    <tr>            
                    <th scope='col'>ID</th>            
                    <th scope='col'>Title</th> 
                    <th scope='col'>Price</th>            
                    <th scope='col'>Thumbnail</th>        
                    </tr>    
                    </thead>    
                <tbody>`
    produc.forEach(a => {
        html = html + `<tr>
                        <th scope='row'>${this.id}</th>
                        <td>${this.title}</td>
                        <td>$ ${this.price}</td>
                        <td><img src=${this.thumbnail} alt="" border=1 height=48 width=48></img></th>
                    </tr>`

    });
    html = html = `</tbody>
                        </table>`
    await Mail(process.env.EMAIL_ADMIN, process.env.PASS_ADMIN, html, "Nuevo pedido")
}

module.exports = { getCarrito, postCarrito, deleteProducto, deleteCarrito, finCompra }