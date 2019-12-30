const db = require('mariadb')

const dbConn = async (andThen) => {
    // authorize by fetching the user from the user database
    const pool = db.createPool({
        host: process.env.DB_HOST, 
        user: process.env.DB_USER, 
        password: process.env.DB_PASS, 
        database: process.env.DB_NAME,
        connectionLimit: 5
    })    

    let conn = await pool.getConnection()
    return andThen(conn)
}

module.exports = dbConn