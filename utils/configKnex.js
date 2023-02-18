const option = {
    mysql: {
        client: 'mysql',
        connection: {
            host: "127.0.0.1",
            user: "root",
            password: "",
            database: "TP12"
        },
        pool: { min: 0, max: 5 },
    },
    sqlite: {
        client: 'sqlite3',
        connection: {
            filename: './utils/DB/mydb.sqlite'
        },
        useNullAsDefault: false
    }
}


module.exports = { option }