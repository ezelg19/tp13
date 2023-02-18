const { Router } = require('express')
const { getProductos, postProductos, getProducto, putProductos, deleteProducto } = require('../controller/productoController.js')
const { auth } = require('../middleware/authJWT.js')
// const { checkAuth } = require('../middleware/checkAuth.js')

const router = Router()

router.get('/', auth, getProductos)

router.post("/", auth, postProductos)

router.get("/:id", auth, getProducto)

router.put("/:id", auth, putProductos)

router.delete("/:id", auth, deleteProducto)

module.exports = router