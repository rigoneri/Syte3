const SERVICES = [
    'twitter',
    'foursquare',
    'github',
    'spotify',
    'youtube',
    'youtube-likes',
    'youtube-uploads',
    'dribbble',
    'instagram',
]

exports.serviceParam = (req, _res, next, id) => {
    if (SERVICES.indexOf(id) >= 0) {
        req.service = id
        next()
    } else {
        const err = new Error('Invalid Service')
        err.status = 404
        next(err)
    }
}

exports.getSettings = async (aws, region, type) => {
    console.log(`Loading ${type} settings`)
    const dynamodb = new aws.DynamoDB({ region })
    const data = await dynamodb
        .getItem({
            Key: aws.DynamoDB.Converter.marshall({ type }),
            TableName: 'settings',
        })
        .promise()

    const settings = aws.DynamoDB.Converter.unmarshall(data.Item).settings
    if (!settings) {
        throw `
            Settings for ${type} not found. 
            Please configure ${type} in the admin tool first.
        `
    }

    return settings
}

exports.storeSettings = async (aws, region, type, settings) => {
    console.log(`Storing ${type} settings`)
    const dynamodb = new aws.DynamoDB({ region })
    await dynamodb
        .putItem({
            Item: aws.DynamoDB.Converter.marshall({
                type,
                settings,
            }),
            TableName: 'settings',
        })
        .promise()
}

exports.getUserInfo = async (aws, region, type) => {
    console.log(`Getting existing ${type} user info`)
    try {
        const dynamodb = new aws.DynamoDB({ region })
        const data = await dynamodb
            .getItem({
                Key: aws.DynamoDB.Converter.marshall({ type }),
                TableName: 'user',
            })
            .promise()
        return aws.DynamoDB.Converter.unmarshall(data.Item).user
    } catch (error) {
        return {}
    }
}

exports.storeUserInfo = async (aws, region, type, user) => {
    console.log('Storing user info')
    const userInfo = {
        Item: aws.DynamoDB.Converter.marshall({
            type,
            user,
        }),
        TableName: 'user',
    }

    const dynamodb = new aws.DynamoDB({ region })
    await dynamodb.putItem(userInfo).promise()
}

exports.storeItems = async (aws, region, type, items) => {
    if (!items) {
        return
    }

    console.log(`Storing ${type} items`)
    const dynamodb = new aws.DynamoDB({ region })

    //batchWriteItem only supports 25 items at a time
    const batches = []
    let currentBatch = []
    items.forEach((item) => {
        //each item needs to be on DynamoDB syntax
        let date = item.timestamp
        delete item.timestamp

        currentBatch.push({
            PutRequest: {
                Item: aws.DynamoDB.Converter.marshall({
                    type,
                    date,
                    details: item,
                }),
            },
        })

        if (currentBatch.length === 25) {
            batches.push(currentBatch)
            currentBatch = []
        }
    })

    if (currentBatch.length) {
        batches.push(currentBatch)
    }

    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i]
        await dynamodb
            .batchWriteItem({
                RequestItems: {
                    timeline: batch,
                },
            })
            .promise()
    }
}
