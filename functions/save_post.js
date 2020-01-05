const auth = require('./lib/auth')
const dbConn = require('./lib/db')
const respond = require('./lib/respond')
const slugify = require('slugify')
const triggerRebuild = require('./lib/rebuild')

const action = async (event,user) => {

    let post = JSON.parse(event.body)

    let update = true

    if (!post.originalCodename) {
        update = false
    }

    if (update) {
        return await dbConn( async (conn) => {
            try {
                if(!post.id) throw new Error("No post ID to update")
                let updateResult = await conn.query(
                    `UPDATE content
                     SET 
                        title = ?,
                        body = ?,
                        excerpt = ?,
                        updated = now(),
                        codename = ?,
                        draft = ?
                     WHERE
                        id = ?
                     `,
                     [
                        post.title,
                        post.body,
                        post.excerpt || post.body.substring(0,500),
                        post.codename || slugify(post.title),
                        post.draft,
                        post.id
                     ]
                )
                let postResult = await conn.query(`SELECT * FROM content WHERE id = ?`,[post.id])                
                triggerRebuild(false) // update could be changing draft status so always rebuild
                return respond(200,{
                    action: "updated",
                    post: postResult[0]
                })
            } catch (e) {
                console.log(e)
                return respond(500,e.toString())
            }
        })        
    } else {
        return await dbConn( async (conn) => {
            try {
                if (!post.codename) {
                    return respond(400,{
                        error: "Post must at least have a slug"
                    })
                }
                // insert
                let createResult = await conn.query(
                    `INSERT INTO content (title,body,excerpt,created,updated,codename,published,draft)
                    VALUES (?,?,?,now(),now(),?,now(),?)`,
                    [
                        post.title,
                        post.body,
                        post.excerpt || post.body.substring(0,500),
                        post.codename || slugify(post.title),
                        post.draft
                    ]
                )
                let postResult = await conn.query(`SELECT * FROM content WHERE id = ?`,[createResult.insertId])
                triggerRebuild(post.draft) // no need to rebuild for drafts
                return respond(200,{
                    action: "created",
                    post: postResult[0]
                })
            } catch (e) {
                console.log(e)
                return respond(500,e.toString())
            }
        })
    }

}

exports.handler = async (event, context) => {
    /* authenticate and authorize, then act */
    return auth(event,action)
}