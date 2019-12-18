const db = require('mariadb')

let posts

const getPosts = async () => {

    const pool = db.createPool({
        host: process.env.DB_HOST, 
        user: process.env.DB_USER, 
        password: process.env.DB_PASS, 
        database: process.env.DB_NAME,
        connectionLimit: 5
    })    

    let conn = await pool.getConnection()
    let rows = await conn.query("SELECT * from content ORDER BY created DESC LIMIT 10")

    return rows

}

// fetches new posts before pages are generated
exports.onPreBootstrap = async () => {
    posts = await getPosts()
}

// recreates each page node with additional context
exports.onCreatePage = ({ page, actions }) => {
    const { createPage, deletePage } = actions
    deletePage(page)
    createPage({
        ...page,
        context: {
            ...page.context,
            posts
        },
    })
}