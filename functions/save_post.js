const auth = require('./lib/auth')
const dbConn = require('./lib/db')
const respond = require('./lib/respond')

const action = async (event,user) => {

    let body = JSON.parse(event.body)
    let codename = body.codename

    if (!codename) return respond(500,{
        "error": "Need a response"
    })

    return await dbConn( async (conn) => {
        let rows = await conn.query("SELECT * from content WHERE codename = ?",'bob')
        return respond(200,{
            "I": "am",
            "The": "post"
        })
    })    

}

exports.handler = async (event, context) => {
    /* authenticate and authorize, then act */
    return auth(event,action)
}