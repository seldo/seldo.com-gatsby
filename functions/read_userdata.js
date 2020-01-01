const auth = require('./lib/auth')
const dbConn = require('./lib/db')
const respond = require('./lib/respond')

const action = async (event,user) => {

    return await dbConn( async (conn) => {
        let rows = await conn.query("SELECT * from users WHERE username = ?",user.screen_name)
        return respond(200,rows[0])
    })    

}

exports.handler = async (event, context) => {
    /* authenticate and authorize, then act */
    return auth(event,action)
}