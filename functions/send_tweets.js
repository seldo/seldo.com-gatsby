const Twitter = require('twitter-lite')
const moment = require('moment-timezone')
const faunadb = require('faunadb')

const oauthConsumerKey = process.env.OAUTH_CONSUMER_KEY
const oauthConsumerSecret = process.env.OAUTH_CONSUMER_SECRET

exports.handler = async (event, context) => {

    /* what time is it? */
    let now = moment().add(1,'minutes')
    let then = moment(now).subtract(3,'minutes')

    /* find all the tweets for the last 3 minutes */
    const q = faunadb.query
    const faunaClient = new faunadb.Client({
        secret: process.env.FAUNADB_SERVER_SECRET
    })
    let results = await faunaClient.query(
        q.Map(
            q.Paginate(
                q.Range(
                    q.Match(q.Index("tweets_by_time_4")),
                    then.utc().format('YYYY-MM-DDTHH:mm'),
                    now.utc().format('YYYY-MM-DDTHH:mm')
                )
            ),
            q.Lambda("x", q.Get(q.Select(1, q.Var("x"))))
        )
    )
    // the return format is goofy
    let tweets = results.data.map( weirdoRef => {
        weirdoRef.data.id = weirdoRef.ref.id
        return weirdoRef.data
    })

    /* send all the tweets */
    let twomises = tweets.map( (tweet) => {
        return new Promise( async (resolve,reject) => {          
            // check the tweet isn't already sent
            if (tweet.sent) {
                resolve()
                return
            }

            // ignore blank tweets
            if (!tweet.what) {
                resolve()
                return
            }

            // get this user's credentials
            let userResult = await faunaClient.query(
                q.Map(
                    q.Paginate(
                      q.Match(q.Index("user_by_name"), tweet.who)
                    ),
                    q.Lambda("X", q.Get(q.Var("X")))
                  )            
            )
            let user = userResult.data[0].data

            // create a twitter client for this user
            let userClient = new Twitter({
                consumer_key: oauthConsumerKey,
                consumer_secret: oauthConsumerSecret,
                access_token_key: user.access_token,
                access_token_secret: user.access_secret
            })        

            let response
            try {
                response = await userClient.post("statuses/update", {
                    status: tweet.what
                })
            } catch (e) {
                console.log(e)
                reject("Dinnae work")
                return
            }

            // if it was sent successfully, mark it as sent
            let updateResult = await faunaClient.query(
                q.Update(
                    q.Ref( q.Collection('tweets'), tweet.id),
                    { data: { sent: true } },
                    )
            )
            console.log("Update result")
            console.log(updateResult)
            if (updateResult) {
                resolve()
            } else {
                reject()
            }

        })
    })

    await Promise.all(twomises)
    
    return {
        statusCode: 200,
        body: JSON.stringify({yay:"cool"})
    }

}