const respond = (status,bodyObj,options) => {
    return {
        statusCode: status,
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(bodyObj)
    }    
}

module.exports = respond