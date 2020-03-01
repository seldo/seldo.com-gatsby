const dbConn = require('./functions/lib/db')
const helpers = require('./src/lib/helpers')
const path = require('path')

// get data from mySQL and put it into GraphQL
// I don't really know why this is considered better than just calling it directly
exports.sourceNodes = async ({ actions: { createNode }, createContentDigest }) => {
    let data = await dbConn( async (conn) => {
        let rows
        if(process.env.LIMIT_ROWS) {
            rows = await conn.query("SELECT * from content WHERE draft is FALSE ORDER BY published DESC LIMIT ?",[parseInt(process.env.LIMIT_ROWS)])
        } else {
            rows = await conn.query("SELECT * from content WHERE draft is FALSE ORDER BY published DESC")
        }
        return rows
    })
    // create nodes for each blog post
    for(let post of data) {
        createNode({
            id: post.codename,
            parent: null,
            children: [],
            postData: post,
            internal: {
                type: `BlogPost`,
                contentDigest: createContentDigest(data),
            },
        })    
    }
}

let getPosts = async (graphql) => {
    const { data } = await graphql(`
        query BlogPostQuery {
            __typename
            allBlogPost {
            nodes {
                postData {
                id
                title
                codename
                body
                created
                draft
                excerpt
                published
                updated
                }
            }
            }
        }
    `)

    let posts = data.allBlogPost.nodes.map( p => {
        return p.postData
    })
    return posts
}

// you could run stuff here
exports.onPreBootstrap = async () => {
}

exports.createPages = async ({ graphql, actions }) => {

    let posts = await getPosts(graphql)

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
// adds recent posts to every page
exports.onCreatePage = async ({ getNodesByType, page, actions }) => {

    let posts = getNodesByType("BlogPost").map( p => {
        return p.postData
    })

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