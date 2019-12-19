const mariadb = require('mariadb')
const Twitter = require('twitter-lite')
const cookie = require('cookie')

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

    let body
    try {
        body = JSON.parse(event.body)
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "failed to parse payload, you should post JSON",
                details: e.toString()
            })
        }
    }

    let tweet = {
        who: username, // must come from auth, do not let user specify!
        what: body.what,
        when: body.when, // danger: a savvy user could specify any number of tweets for themselves
        sent: false
    }

    /* save this tweet */
    const q = faunadb.query
    const faunaClient = new faunadb.Client({
        secret: process.env.FAUNADB_SERVER_SECRET
    })
    let stored
    if (body.id) {
        // update existing tweet
        try {
            stored = await faunaClient.query(
                q.Update(
                    q.Ref(
                        q.Collection('tweets'),
                        body.id
                    ),
                    {
                        data: tweet
                    }
                )                    
            )
        } catch (e) {
            console.log("Error storing tweet")
            console.log(tweet)
        }
    } else {
        // store new tweet
        try {
            stored = await faunaClient.query(
                q.Create(
                    q.Ref('collections/tweets'),
                    {data:tweet}
                )
            )
        } catch (e) {
            console.log("Error storing tweet")
            console.log(tweet)
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify(stored)
    }

}