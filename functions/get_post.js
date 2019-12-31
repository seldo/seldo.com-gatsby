const auth = require('./lib/auth')
const dbConn = require('./lib/db')

const action = async (event,user) => {

    console.log(event)

    return await dbConn( async (conn) => {
        let rows = await conn.query("SELECT * from content WHERE codename = ?","becoming_american")
        return {
            statusCode: 200,
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(rows[0])
        }    
    })    

}

exports.handler = async (event, context) => {
    /* authenticate and authorize, then act */
    return auth(event,action)
}