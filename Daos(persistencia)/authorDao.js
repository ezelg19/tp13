const mongoose = require('mongoose')
const model = require('../utils/DB/modelMDB.js')

class Authors {

    constructor() {
        this.ID_FIELD = "_id"
        this.connect()
    }

    async connect() {
        try {
            const URL = 'mongodb://localhost:27017/authors'
            const rta = await mongoose.connect(URL, {
                useUnifiedTopology: true,
                useNewUrlParser: true
            })
            console.log('Base de Datos Mongo conectada')
        } catch (error) {
            console.log('Error al conectarse a la Base de Datos en Mongo', error)
        }
    }

    async save(obj) {
        try {
            obj.email = obj.email.toLowerCase()
            obj.carrito = []
            const author = new model(obj)
            const guardado = await author.save()
            return guardado
        } catch (error) {
            return { descripcion: 'authors.save()', error: error }
        }
    }

    async actualizar(obj) {
        try {
            let update = await model.updateOne({ [this.ID_FIELD]: obj.id }, { $set: obj })
            return update
        } catch (error) {
            return { descripcion: 'authors.actualizar()', error: error }
        }
    }

    async getByUser(usuario) {
        try {
            const { email, numTel } = usuario
            const user = await model.findOne({ email: email }, { password: 0, name: 0 })
            const byNum = await model.findOne({ numTel: numTel }, { email: 1, name: 1, password: 1, numTel: 1 })
            if (!user && byNum) {
                return byNum;
            }
            return user;
        } catch (error) {
            return { descripcion: 'authors.getByUser()', error: error }
        }
    }

    async getAll() {
        try {
            const users = await model.find({})
            console.log('users: ', users)
        } catch (error) {
            return { descripcion: 'authors.getAll()', error: error }
        }
    }

    async verificar(id) {
        try {
            const pass = await this.knex.from(this.table).select('username').where("ROWID", "=", id).then(data => data)
            return pass
        } catch (error) {
            return { descripcion: 'authors.verificar()', error: error }
        }
    }

    async delete(email) {
        try {
            console.log(`Borrando usuario ${email}`)
            await model.findOneAndDelete({ email: email })

        } catch (error) {
            return { descripcion: 'authors.delete()', error: error }
        }
    }
}

const authors = new Authors()
// authors.getAll()
// authors.delete('eze.mk.15@gmail.com')
module.exports = { authors }