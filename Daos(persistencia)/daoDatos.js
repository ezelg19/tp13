const datosArray = [] //simula base de datos

async function leerDatos() { 
    return datosArray //devolver desde base de datos
}

async function guardarDato(newDato) { 
    datosArray.push(newDato)
    return newDato
}

async function leerDato(id){
    return await datosArray.find(item =>item.id ===id)
}

module.exports = { leerDatos, guardarDato , leerDato}