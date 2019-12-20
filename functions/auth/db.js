const db = require('mariadb')

const isAuthed = async (username) => {

    // authorize by fetching the user from the user database
    const pool = db.createPool({
        host: process.env.DB_HOST, 
        user: process.env.DB_USER, 
        password: process.env.DB_PASS, 
        database: process.env.DB_NAME,
        connectionLimit: 5
    })    

    let conn = await pool.getConnection()
    let rows = await conn.query("SELECT * FROM users WHERE username = ?",username)

    if (rows[0].username === username) {
        return true
    } else {
        return false
    }

}

module.exports = isAuthed