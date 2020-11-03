const AWS = require('aws-sdk')
const AWS_REGION = process.env.AWS_REGION || 'us-east-1'
const fetch = require('node-fetch')
const parseISO = require('date-fns/parseISO')
const { getSettings, storeUserInfo, storeItems } = require('syte-common')

const DRIBBBLE_API_URL = 'https://api.dribbble.com/v2/'
// note: we will not handle fetch errors since if will force the
// lambda to crash and we will get notified with the stacktrace.

const fetchUser = async (settings) => {
    console.log('Fetching user')
    const url = `${DRIBBBLE_API_URL}user/?access_token=${settings.token}`
    const response = await fetch(url)
    if (!response.ok) {
        throw `API returned a ${response.status} status: ${response.statusText}`
    }

    const user = await response.json()
    return {
        id: user.id,
        name: user.name,
        username: user.login,
        url: user.html_url,
        picture: user.avatar_url,
        followers: user.followers_count || 0,
        following: user.followings_count || 0,
        shots: user.shots_count || 0,
        bio: user.bio,
    }
}

const fetchRecentShots = async (settings) => {
    console.log('Fetching Recent Activity')
    const url = `${DRIBBBLE_API_URL}user/shots?access_token=${settings.token}&per_page=30`
    const response = await fetch(url)
    const result = await response.json()

    let recentShots = []
    result.forEach((item) => {
        let shot = {
            id: item.id,
            date: item.updated_at,
            timestamp: parseISO(item.updated_at).getTime(),
            type: 'dribbble',
            title: item.title,
            text: item.description,
            views: item.views_count || 0, //no longer supported with api v2
            likes: item.likes_count || 0, //no longer supported with api v2
            comments: item.comments_count || 0, //no longer supported with api v2
            url: item.html_url,
        }

        if (item.images) {
            shot.picture = item.images.normal

            if (item.images.hidpi) {
                shot.pictureHD = item.images.hidpi
            } else {
                shot.pictureHD = item.images.normal
                if (item.images.normal.indexOf('.gif') > 0) {
                    shot.picture = item.images.normal.replace(/.gif/g, '_still.gif')
                }
            }
        }

        recentShots.push(shot)
    })
    return recentShots
}

exports.handler = async () => {
    const type = 'dribbble'
    const settings = await getSettings(AWS, AWS_REGION, type)
    const user = await fetchUser(settings)
    await storeUserInfo(AWS, AWS_REGION, type, user)

    const shots = await fetchRecentShots(settings)
    await storeItems(AWS, AWS_REGION, type, shots)
    console.log('Done!!')
}
