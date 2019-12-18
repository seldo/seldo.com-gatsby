const Twitter = require('twitter-lite')
const cookie = require('cookie')
 
const oauthConsumerKey = process.env.OAUTH_CONSUMER_KEY
const oauthConsumerSecret = process.env.OAUTH_CONSUMER_SECRET
const BASE_HOSTNAME = process.env.BASE_HOSTNAME || "http://localhost:8888"

/* export our lambda function as named "handler" export */
exports.handler = async (event, context) => {

  const client = new Twitter({
    consumer_key: oauthConsumerKey,
    consumer_secret: oauthConsumerSecret
  })

  let callback = BASE_HOSTNAME + "/.netlify/functions/oauth_callback"

  console.log(`Callback is ${callback}`)

  let response = await client.getRequestToken(callback)

  let oauthToken = response.oauth_token

  console.log("oauth token response")
  console.log(response)

  // redirect to twitter
  return {
    statusCode: 302,
    headers: {
      location: "https://api.twitter.com/oauth/authorize?oauth_token=" + oauthToken,
      "Set-Cookie": cookie.serialize('mysecrets',JSON.stringify({token_secret: response.oauth_token_secret}))
    },
    body: ""
  } 

}