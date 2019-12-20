const Twitter = require('twitter-lite')
const cookie = require('cookie')
const isAuthed = require('./auth/db')

// FIXME: local env is not sending these

const oauthConsumerKey = process.env.OAUTH_CONSUMER_KEY
const oauthConsumerSecret = process.env.OAUTH_CONSUMER_SECRET

exports.handler = async (event, context) => {

    /* read cookies and query twitter to authenticate */
    let cookies, secrets, accessToken, accessSecret
    try {
        cookies = cookie.parse(event.headers.cookie)
        secrets = JSON.parse(cookies.mysecrets)
        accessToken = secrets.access_token
        accessSecret = secrets.access_token_secret
    } catch (e) {
        return {
            statusCode: 403,
            body: JSON.stringify({
                error: "authorization failed, are you logged in via twitter?",
                details: e.toString()
            })
        }
    }

    const client = new Twitter({
        consumer_key: oauthConsumerKey,
        consumer_secret: oauthConsumerSecret,
        access_token_key: accessToken,
        access_token_secret: accessSecret
    })

    let response = await client.get("account/verify_credentials")
    let username = response.screen_name

    /* read username to authorize */  
    if (!isAuthed(username)) {
        return {
            statusCode: 403,
            body: JSON.stringify({
                error: "Not authorized",
                details: `Username was ${username}`
            })
        }
    }
    // okay, authenticated and authorized now

    // FIXME: need to centralize SQL somewhere!
    const pool = db.createPool({
        host: process.env.DB_HOST, 
        user: process.env.DB_USER, 
        password: process.env.DB_PASS, 
        database: process.env.DB_NAME,
        connectionLimit: 5
    })    

    let conn = await pool.getConnection()
    let rows = await conn.query("SELECT * from users WHERE username = ?",username)

    return {
        statusCode: 200,
        body: JSON.stringify(rows[0])
    }

}