const { Router } = require('express')
const { getCarrito, postCarrito, deleteProducto, deleteCarrito, finCompra } = require('../controller/carritoController.js')
const { auth } = require('../middleware/authJWT.js')
// const { checkAuth } = require('../middleware/checkAuth.js')

const router = Router()

router.get('/', auth, getCarrito)

router.post("/:idProducto?", auth, postCarrito)

router.get('/finCompra', auth, finCompra)

router.delete("/:idProducto", auth, deleteProducto)

router.delete("/", auth, deleteCarrito)

module.exports = router