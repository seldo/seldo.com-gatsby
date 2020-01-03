const dbConn = require('./functions/lib/db')
const helpers = require('./src/lib/helpers')
const path = require('path')

let posts

const getPosts = async () => {

    return await dbConn( async (conn) => {
        let rows = await conn.query("SELECT * from content WHERE draft is FALSE ORDER BY published DESC")
        return rows
    })

}

// fetches new posts before pages are generated
exports.onPreBootstrap = async () => {
    posts = await getPosts()
}

exports.createPages = async ({ graphql, actions }) => {
    for(let i = 0; i < posts.length; i++) {
        let post = posts[i]
        console.log(`Creating ${post.codename}`)
        actions.createPage({
            path: helpers.makeLink(post.codename),
            component: path.resolve('./src/components/post-page.js'),
            context: {                
                post
            },
        })    
    }
}

// recreates each page node with additional context
exports.onCreatePage = ({ page, actions }) => {
    const { createPage, deletePage } = actions
    if (page.path === "/") {
        deletePage(page)
        createPage({
            ...page,
            context: {
                ...page.context,
                posts: posts.slice(0,10)
            },
        })    
    }
}