const db = require('mariadb')

const pool = db.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME,
    connectionLimit: 5
})

const dbConn = async (andThen) => {
    // authorize by fetching the user from the user database
    let conn = await pool.getConnection()
    let ret = await andThen(conn)
    conn.end()
    return ret
}

module.exports = dbConn