const auth = require('./lib/auth')
const dbConn = require('./lib/db')
const respond = require('./lib/respond')

const action = async (event,user) => {

    let post = JSON.parse(event.body)

    if (!post.id) {
        return respond(400,{
            error: "You cannot delete without supplying a post ID"
        })
    }

    return await dbConn( async (conn) => {
        try {
            let updateResult = await conn.query(
                `DELETE FROM content WHERE id = ?`,[post.id]
            )
            console.log(updateResult)
            return respond(200,{
                action: "deleted"
            })
        } catch (e) {
            console.log(e)
            return respond(500,e)
        }
    })        

}

exports.handler = async (event, context) => {
    /* authenticate and authorize, then act */
    return auth(event,action)
}