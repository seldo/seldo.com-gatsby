const dbConn = require('./functions/lib/db')
const helpers = require('./src/lib/helpers')
const path = require('path')

let posts

const getPosts = async () => {

    return await dbConn( async (conn) => {
        let rows
        if(process.env.LIMIT_ROWS) {
            rows = await conn.query("SELECT * from content WHERE draft is FALSE ORDER BY published DESC LIMIT ?",[parseInt(process.env.LIMIT_ROWS)])
        } else {
            rows = await conn.query("SELECT * from content WHERE draft is FALSE ORDER BY published DESC")
        }
        return rows
    })

}

// fetches new posts before pages are generated
exports.onPreBootstrap = async () => {
    posts = await getPosts()
}

exports.createPages = async ({ graphql, actions }) => {
    // create individual posts
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

    // create giant archive page
    actions.createPage({
        path: "/archive",
        component: path.resolve('./src/components/archive-page.js'),
        context: {                
            posts
        },
    })    
}

// recreates each page node with additional context
exports.onCreatePage = ({ page, actions }) => {
    const { createPage, deletePage } = actions
    deletePage(page)
    createPage({
        ...page,
        context: {
            ...page.context,
            recentPosts: posts.slice(0,10)
        },
    })    
}