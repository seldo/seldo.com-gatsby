const Twitter = require('twitter-lite')
const cookie = require('cookie')
const isAuthorized = require('./authorize')

const oauthConsumerKey = process.env.OAUTH_CONSUMER_KEY
const oauthConsumerSecret = process.env.OAUTH_CONSUMER_SECRET

/** this does both authorization and authentication */
const auth = async (event,andThen) => {

    /* read cookies and query twitter to authenticate */
    let cookies, secrets, accessToken, accessSecret
    try {
        cookies = cookie.parse(event.headers.cookie)
        secrets = JSON.parse(cookies.mysecrets)
        accessToken = secrets.access_token
        accessSecret = secrets.access_token_secret
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "authorization failed, problem with cookies",
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

    let user
    try {
        user = await client.get("account/verify_credentials")
    } catch (e) {
        console.log(e)
        return {
            statusCode: 403,
            body: JSON.stringify({
                error: "You are not logged in",
                details: e.errors
            })
        }
    }
    // okay, authenticated: they are the twitter user they say they are
    let username = user.screen_name

    if ( await isAuthorized(username)) {
        // okay, authenticated and authorized now
        return await andThen(event,user)
    } else {
        // authenticated but not authorized
        return {
            statusCode: 403,
            body: JSON.stringify({
                error: "Not authorized",
                details: `Username was ${username}`
            })
        }
    }
}

module.exports = auth