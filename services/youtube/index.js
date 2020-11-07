const AWS = require('aws-sdk')
const AWS_REGION = process.env.AWS_REGION || 'us-east-1'
const fetch = require('node-fetch')
const formatISO = require('date-fns/formatISO')
const parseISO = require('date-fns/parseISO')
const { getSettings, storeSettings, storeUserInfo, storeItems } = require('syte-common')

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/'
const YOUTUBE_TOKEN_URL = 'https://accounts.google.com/o/oauth2/token'
// note: we will not handle fetch errors since if will force the
// lambda to crash and we will get notified with the stacktrace.

const fetchUser = async (settings) => {
    console.log('Fetching user')
    const url = `${YOUTUBE_API_URL}channels?access_token=${settings.token}&part=brandingSettings,statistics,snippet&mine=true`
    const response = await fetch(url)
    if (!response.ok) {
        throw `API returned a ${response.status} status: ${response.statusText}`
    }

    const { items } = await response.json()
    const result = items[0]
    const user = {
        id: result.id,
        name: result.snippet.title,
        url: 'https://www.youtube.com/channel/' + result.id,
    }

    if (result.snippet.thumbnails && result.snippet.thumbnails.medium) {
        user.picture = result.snippet.thumbnails.medium.url
    }

    if (result.statistics) {
        user.subscribers = result.statistics.subscriberCount
    }

    if (result.brandingSettings && result.brandingSettings.image) {
        user.banner = result.brandingSettings.image.bannerTabletLowImageUrl
    }

    return user
}

const fetchUploads = async (settings) => {
    console.log('Fetching Uploads')
    const url = `${YOUTUBE_API_URL}playlistItems?part=snippet,status&maxResults=50&playlistId=${settings.channelId}`
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${settings.token}`,
        },
    })
    const { items } = await response.json()

    let uploads = []
    items.forEach(({ status, snippet: post }) => {
        if (status.privacyStatus === 'public' && post.publishedAt && post.resourceId) {
            let item = {
                id: post.resourceId.videoId,
                date: post.publishedAt,
                type: 'youtube',
                title: post.title,
                description: linkifyText(post.description),
                timestamp: parseISO(post.publishedAt).getTime(),
            }

            const { thumbnails } = post
            if (thumbnails.medium) {
                item.image = thumbnails.medium.url
            } else if (thumbnails.high) {
                item.image = thumbnails.high.url
            } else if (thumbnails.default) {
                item.image = thumbnails.high.default
            }

            uploads.push(item)
        }
    })
    return uploads
}

const fetchLikes = async (settings) => {
    console.log('Fetching Likes')
    const url = `${YOUTUBE_API_URL}playlistItems?part=snippet&maxResults=50&playlistId=${settings.likesId}`
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${settings.token}`,
        },
    })
    const { items } = await response.json()

    let likedPosts = []
    items.forEach((item) => {
        const { snippet } = item
        const post = {
            id: item.id,
            date: snippet.publishedAt,
            published: snippet.publishedAt,
            timestamp: parseISO(snippet.publishedAt).getTime(),
            title: snippet.title,
            type: 'youtube-like',
        }

        const { thumbnails } = snippet
        if (thumbnails.medium) {
            post.image = thumbnails.medium.url
        } else if (thumbnails.high) {
            post.image = thumbnails.high.url
        } else if (thumbnails.default) {
            post.image = thumbnails.high.default
        }

        if (snippet.resourceId && snippet.resourceId.videoId) {
            post.videoId = snippet.resourceId.videoId
        }

        likedPosts.push(post)
    })

    return likedPosts
}

const ensureAuth = async (settings) => {
    if (settings.updated) {
        const updated = parseISO(settings.updated)
        const now = new Date()
        const deltaSeconds = (now.getTime() - updated.getTime()) / 1000
        if (deltaSeconds < 3600) {
            return
        }
    }

    await updateAuth(settings)
}

const updateAuth = async (settings) => {
    console.log('Update auth settings')
    const url = YOUTUBE_TOKEN_URL

    const params = new URLSearchParams()
    params.append('grant_type', 'refresh_token')
    params.append('refresh_token', settings.refresh)
    params.append('client_id', settings.clientId)
    params.append('client_secret', settings.clientSecret)

    const response = await fetch(url, {
        method: 'POST',
        body: params,
    })

    const result = await response.json()
    if (result.access_token) {
        settings.token = result.access_token
        settings.refresh = result.refresh_token ? result.refresh_token : settings.refresh
        settings.updated = formatISO(new Date())
        storeSettings(AWS, AWS_REGION, 'youtube', settings)
    }
}

const linkifyText = (text) => {
    text = text.replace(/(https?:\/\/\S+)/gi, function (s) {
        return '<a href="' + s + '" target="_blank">' + s + '</a>'
    })

    text = text.replace(/\n/g, '<br>')
    return text
}

exports.handler = async () => {
    const settings = await getSettings(AWS, AWS_REGION, 'youtube')
    await ensureAuth(settings)

    const user = await fetchUser(settings)
    await storeUserInfo(AWS, AWS_REGION, 'youtube', user)

    if (settings.channelId) {
        const uploads = await fetchUploads(settings)
        await storeItems(AWS, AWS_REGION, 'youtube-uploads', uploads)
    }

    if (settings.likesId) {
        const likes = await fetchLikes(settings)
        await storeItems(AWS, AWS_REGION, 'youtube-likes', likes)
    }

    console.log('Done!!')
}
