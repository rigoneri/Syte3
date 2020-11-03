const AWS = require('aws-sdk')
const AWS_REGION = process.env.AWS_REGION || 'us-east-1'
const fetch = require('node-fetch')
const formatISO = require('date-fns/formatISO')
const parseISO = require('date-fns/parseISO')
const { getSettings, storeSettings, storeUserInfo, storeItems } = require('syte-common')

const INSTAGRAM_API_URL = 'https://graph.instagram.com/'
const INSTAGRAM_TOKEN_URL = 'https://graph.instagram.com/refresh_access_token'
// note: we will not handle fetch errors since if will force the
// lambda to crash and we will get notified with the stacktrace.

const fetchUser = async (settings) => {
    console.log('Fetching user')

    const params = new URLSearchParams()
    const fields = ['id', 'username', 'media_count']
    params.append('fields', fields.join(','))

    const response = await fetch(`${INSTAGRAM_API_URL}me?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${settings.token}`,
        },
    })
    if (!response.ok) {
        throw `API returned a ${response.status} status: ${response.statusText}`
    }

    const user = await response.json()
    return {
        id: user.id,
        username: user.username,
        full_name: '(Rigo) Rodrigo Neri', // TODO: figure out how to get this without hard coding
        counts: {
            media: user.media_count || 0,
        },
        url: `https://instagram.com/${user.username}`,
    }
}

const fetchMedia = async (settings) => {
    console.log('Fetching Recent Media')
    const url = `${INSTAGRAM_API_URL}me/media`

    const params = new URLSearchParams()
    const fields = ['id', 'caption', 'media_type', 'media_url', 'permalink', 'thumbnail_url', 'timestamp', 'username']
    params.append('fields', fields.join(','))

    const response = await fetch(`${url}?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${settings.token}`,
        },
    })

    const { data } = await response.json()

    let result = []
    data.forEach((item) => {
        const createdDate = parseISO(item.timestamp)
        const media = {
            id: item.id,
            date: createdDate.toISOString(),
            timestamp: createdDate.getTime(),
            type: 'instagram',
            url: item.permalink,
            text: item.caption,
            picture: item.thumbnail_url,
        }

        if (item.media_type === 'VIDEO') {
            media.video = {
                url: item.media_url,
                width: 600,
                heigh: 600,
            }
        } else {
            media.picture = item.media_url
        }

        result.push(media)
    })

    return result
}

const ensureAuth = async (settings) => {
    if (settings.updated) {
        const updated = parseISO(settings.updated)
        const now = new Date()
        const deltaSeconds = (now.getTime() - updated.getTime()) / 1000
        //5 days
        if (deltaSeconds < 432000) {
            return
        }
    }

    await updateAuth(settings)
}

const updateAuth = async (settings) => {
    console.log('Update auth settings')
    const url = INSTAGRAM_TOKEN_URL

    const params = new URLSearchParams()
    params.append('grant_type', 'ig_refresh_token')
    params.append('access_token', settings.token)

    const response = await fetch(`${url}?${params.toString()}`)
    const result = await response.json()

    if (result.access_token) {
        settings.token = result.access_token
        settings.updated = formatISO(new Date())
        storeSettings(AWS, AWS_REGION, 'instagram', settings)
    }
}

exports.handler = async () => {
    const type = 'instagram'
    const settings = await getSettings(AWS, AWS_REGION, type)
    await ensureAuth(settings)

    const user = await fetchUser(settings)
    await storeUserInfo(AWS, AWS_REGION, type, user)

    const media = await fetchMedia(settings)
    await storeItems(AWS, AWS_REGION, type, media)

    console.log('Done!!')
}
