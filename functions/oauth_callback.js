const faunadb = require('faunadb')
const Twitter = require('twitter-lite')
const cookie = require('cookie')
const moment = require('moment-timezone')

const oauthConsumerKey = process.env.OAUTH_CONSUMER_KEY
const oauthConsumerSecret = process.env.OAUTH_CONSUMER_SECRET
const DEFAULT_LATITUDE = '37.7349'
const DEFAULT_LONGITUDE = '-122.441378'
const DEFAULT_TIMEZONE = 'America/Los_Angeles'

/* export our lambda function as named "handler" export */
exports.handler = async (event, context) => {

    let requestToken = event.queryStringParameters.oauth_token
    let oauthVerifier = event.queryStringParameters.oauth_verifier

    let cookies = cookie.parse(event.headers.cookie)

    let secrets = JSON.parse(cookies.mysecrets)
    let requestTokenSecret = secrets.token_secret

    const client = new Twitter({
        consumer_key: oauthConsumerKey,
        consumer_secret: oauthConsumerSecret
    })

    let response = await client.getAccessToken({
        key: requestToken,
        secret: requestTokenSecret,
        verifier: oauthVerifier
    })

    // get the user details using our new access token and secret
    let accessToken = response.oauth_token
    let accessSecret = response.oauth_token_secret
    let username = response.screen_name

    // store the access token and secret for this user so we can use it to send tweets
    let user = {
        name: username,
        created: moment.utc().format(),
        access_token: accessToken,
        access_secret: accessSecret,
        location: {
            latitude: DEFAULT_LATITUDE,
            longitude: DEFAULT_LONGITUDE
        },
        timezone: DEFAULT_TIMEZONE
    }
    const q = faunadb.query
    const faunaClient = new faunadb.Client({
        secret: process.env.FAUNADB_SERVER_SECRET
    })
    let stored
    try {
        stored = await faunaClient.query(q.Create(q.Ref('collections/users'), {data:user}))
    } catch (e) {
        console.log("User already existed, that's okay")
    }    

    // redirect to twitter
    return {
        statusCode: 302,
        headers: {
            "Set-Cookie": cookie.serialize('mysecrets',JSON.stringify({
                token_secret: requestTokenSecret,
                access_token: accessToken,
                access_token_secret: accessSecret
            })),
            "Location": "/"
        },
        body: ""
    }

}