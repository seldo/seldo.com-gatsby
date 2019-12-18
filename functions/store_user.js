const faunadb = require('faunadb')
const Twitter = require('twitter-lite')
const cookie = require('cookie')
const moment = require('moment-timezone')

const oauthConsumerKey = process.env.OAUTH_CONSUMER_KEY
const oauthConsumerSecret = process.env.OAUTH_CONSUMER_SECRET

exports.handler = async (event, context) => {

    /* read cookies and query twitter to confirm their identity */
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
    let username = response.screen_name // this is authenticated

    // get the posted data
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

    // connect to fauna
    const q = faunadb.query
    const faunaClient = new faunadb.Client({
        secret: process.env.FAUNADB_SERVER_SECRET
    })

    // get the id of this user so we can update
    let userResult = await faunaClient.query(
        q.Map(
            q.Paginate(
                q.Match(q.Index("user_by_name"), username)
            ),
            q.Lambda("X", q.Get(q.Var("X")))
            )            
    )
    let userId = userResult.data[0].ref.id

    /* update the user */
    let stored
    try {
        stored = await faunaClient.query(
            q.Update(
                q.Ref(
                    q.Collection('users'),
                    userId
                ),
                {
                    data: {
                        location: body.location,
                        timezone: body.timezone
                    }
                }
            )                    
        )
    } catch (e) {
        console.log("Error storing user")
        console.log(body)
    }

    return {
        statusCode: 200,
        body: JSON.stringify(stored)
    }

}