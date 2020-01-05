const fetch = require('node-fetch')

const triggerRebuild = async (draft) => {
    // we don't rebuild for drafts because nothing visible has changed
    if (!draft) {
        let res = await fetch(process.env.BUILD_HOOK,{
            method: "POST"
        })
        return {
            status: res.status,
            action: "posted"
        }
    } else {
        return {
            status: 200,
            action: "nothing"
        }
    }
}

module.exports = triggerRebuild