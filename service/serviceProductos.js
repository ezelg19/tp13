const { leerDatos, guardarDato } = require("../Daos(persistencia)/daoDatos")


const obtenerDatos = async () => { 
    return await leerDatos() //desde Dao
}
const crearDato = async (datos) => { 
    datos.fyh = new Date()
    await guardarDato(datos) //base de datos
    return datos
}


module.exports={ obtenerDatos, crearDato}