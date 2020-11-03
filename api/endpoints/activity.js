const AWS = require('aws-sdk')
const AWS_REGION = process.env.AWS_REGION || 'us-east-1'

exports.getActivity = async (service, page, limit) => {
    console.log(`Loading ${service} recent activity`)

    const dynamodb = new AWS.DynamoDB({ region: AWS_REGION })
    let query = {
        TableName: 'timeline',
        KeyConditionExpression: '#T = :T',
        ExpressionAttributeNames: {
            '#T': 'type',
        },
        ExpressionAttributeValues: {
            ':T': {
                S: service,
            },
        },
        ScanIndexForward: false,
        Limit: limit && limit > 0 && limit < 100 ? limit : 10,
    }

    if (page && validateTimestamp(page)) {
        query.ExclusiveStartKey = {
            date: {
                N: `${page}`,
            },
            type: {
                S: service,
            },
        }
    }

    const data = await dynamodb.query(query).promise()

    let nextPage = null
    if (data.LastEvaluatedKey) {
        nextPage = AWS.DynamoDB.Converter.unmarshall(data.LastEvaluatedKey).date
    }

    if (data.Items && data.Items.length) {
        let items = data.Items.map((item) => AWS.DynamoDB.Converter.unmarshall(item).details)
        return {
            data: items,
            nextPage,
        }
    }

    return {}
}

exports.getActivityByRange = async (service, start, end) => {
    console.log(`Loading ${service} activity by range`)
    if (!validateTimestamp(start) || !validateTimestamp(end)) {
        return {}
    }

    const dynamodb = new AWS.DynamoDB({ region: AWS_REGION })
    let query = {
        TableName: 'timeline',
        KeyConditionExpression: '#T = :T AND #S BETWEEN :S AND :E',
        ExpressionAttributeNames: {
            '#T': 'type',
            '#S': 'date',
        },
        ExpressionAttributeValues: {
            ':T': {
                S: service,
            },
            ':S': {
                N: start,
            },
            ':E': {
                N: end,
            },
        },
        ScanIndexForward: false,
    }

    const data = await dynamodb.query(query).promise()
    if (data.Items && data.Items.length) {
        let items = data.Items.map((item) => AWS.DynamoDB.Converter.unmarshall(item).details)
        return {
            data: items,
        }
    }

    return {}
}

const validateTimestamp = (timestamp) => {
    let ts = parseInt(timestamp)
    if (isNaN(ts) || !Number.isSafeInteger(ts)) {
        return false
    }

    const from = new Date('2000/01/01').getTime()
    const to = new Date('2100/01/01').getTime()
    if (ts < from && ts > to) {
        return false
    }

    return true
}
