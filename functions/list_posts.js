const db = require('mariadb')

exports.handler = async (event, context) => {

    const pool = db.createPool({
        host: process.env.DB_HOST, 
        user: process.env.DB_USER, 
        password: process.env.DB_PASS, 
        database: process.env.DB_NAME,
        connectionLimit: 5
    })    

    let conn = await pool.getConnection()
    let rows = await conn.query("SELECT * from content ORDER BY created DESC LIMIT 10")

    return {
        statusCode: 200,
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            rows
        })
    }

}