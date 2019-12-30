const dbConn = require('./db')

const isAuthorized = async (username) => {

    /* check this username in our db to authorize */  
    return await dbConn( async (conn) => {
        let rows = await conn.query("SELECT * FROM users WHERE username = ?",username)

        if (rows[0].username === username) {
            return true
        } else {
            return false
        }
    
    })

}

module.exports = isAuthorized