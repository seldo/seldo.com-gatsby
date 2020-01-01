const dbConn = require('./lib/db')
const respond = require('./lib/respond')

exports.handler = async (event, context) => {

    return await dbConn( async (conn) => {
        let rows = await conn.query("SELECT * from content ORDER BY created DESC LIMIT 10")

        return respond(200,{
            rows
        })
    })

}