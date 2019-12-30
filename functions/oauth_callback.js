const Twitter = require('twitter-lite')
const cookie = require('cookie')
const isAuthorized = require('./lib/authorize')

const oauthConsumerKey = process.env.OAUTH_CONSUMER_KEY
const oauthConsumerSecret = process.env.OAUTH_CONSUMER_SECRET

/* export our lambda function as named "handler" export */
exports.handler = async (event, context) => {

    // twitter will send back a token and verifier
    let requestToken = event.queryStringParameters.oauth_token
    let oauthVerifier = event.queryStringParameters.oauth_verifier

    // the cookies will prove it's the same user who made the original request
    let cookies = cookie.parse(event.headers.cookie)

    let secrets = JSON.parse(cookies.mysecrets)
    let requestTokenSecret = secrets.token_secret

    // make a call to twitter for the user's token and secret
    const client = new Twitter({
        consumer_key: oauthConsumerKey,
        consumer_secret: oauthConsumerSecret
    })

    // the screen name here is authentication (not authorization)
    let response = await client.getAccessToken({
        key: requestToken,
        secret: requestTokenSecret,
        verifier: oauthVerifier
    })

    let accessToken = response.oauth_token
    let accessSecret = response.oauth_token_secret
    let username = response.screen_name

    // TODO: store the access token and secret for this user so we can use it to send tweets

    // if admin, redirect to admin screen
    // if not explode in confusion
    if (isAuthorized(username)) {
        return {
            statusCode: 302,
            headers: {
                "Set-Cookie": cookie.serialize('mysecrets',JSON.stringify({
                    token_secret: requestTokenSecret,
                    access_token: accessToken,
                    access_token_secret: accessSecret
                })),
                "Location": "/admin/"
            },
            body: ""
        }    
    } else {
        return {
            statusCode: 500,
            body: "What the fuck"
        }
    }

}