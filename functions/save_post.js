const auth = require('./lib/auth')
const dbConn = require('./lib/db')
const respond = require('./lib/respond')
const slugify = require('slugify')

const action = async (event,user) => {

    let post = JSON.parse(event.body)

    console.log(post)

    let update = true

    if (!post.originalCodename) {
        update = false
    }

    if (update) {
        return await dbConn( async (conn) => {
            let rows = await conn.query("-- MOOP",)
            return respond(200,{
                "I": "am",
                "The": "post"
            })
        })        
    } else {
        return await dbConn( async (conn) => {
            let result = await conn.query(
                `INSERT INTO content (title,body,excerpt,created,updated,codename,published,draft)
                VALUES (?,?,?,now(),now(),?,now(),?)`,
                post.title,
                post.body,
                post.excerpt || post.body.substring(0,500),
                slugify(post.title,{lower:true}),
                post.draft
                )
            console.log(result)
            return respond(200,result)
        })
    }

}

exports.handler = async (event, context) => {
    /* authenticate and authorize, then act */
    return auth(event,action)
}