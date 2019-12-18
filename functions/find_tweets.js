const faunadb = require('faunadb')
const moment = require('moment-timezone')

exports.handler = async (event, context) => {

    /* what time is it? */
    let now = moment().add(1,'minutes')
    let then = moment(now).subtract(3,'minutes')

    console.log(`Looking for tweets between ${now.utc()} and ${then.utc()}`)

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

    return {
        statusCode: 200,
        body: JSON.stringify(tweets)
    }

}