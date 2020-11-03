const AWS = require('aws-sdk')
const AWS_REGION = process.env.AWS_REGION || 'us-east-1'
const fetch = require('node-fetch')
const formatISO = require('date-fns/formatISO')
const { getSettings, storeUserInfo, storeItems } = require('syte-common')

const FOURSQUARE_API = 'https://api.foursquare.com/v2/'
// note: we will not handle fetch errors since if will force the
// lambda to crash and we will get notified with the stacktrace.

const fetchUser = async (settings) => {
    console.log('Fetching user')
    const url = `${FOURSQUARE_API}users/self?oauth_token=${settings.token}&v=20160520`
    const response = await fetch(url)
    if (!response.ok) {
        throw `API returned a ${response.status} status: ${response.statusText}`
    }

    const result = await response.json()
    const { user } = result.response
    return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        url: user.canonicalUrl,
        checkins: user.checkins ? user.checkins.count : null,
        friends: user.friends ? user.friends.count : null,
        bio: user.bio && user.bio.length ? user.bio : null,
        location: user.homeCity,
        picture:
            user.photo && user.photo.prefix && user.photo.suffix
                ? `${user.photo.prefix}260x260${user.photo.suffix}`
                : null,
    }
}

const fetchRecentCheckins = async (settings) => {
    console.log('Fetching Recent Activity')
    const url = `${FOURSQUARE_API}users/self/checkins?oauth_token=${settings.token}&v=20160520&limit=100`
    const response = await fetch(url)
    const result = await response.json()
    const { checkins } = result.response

    let recentCheckins = []
    checkins.items.forEach((checkin) => {
        if (checkin.venue) {
            recentCheckins.push(parseCheckin(checkin))
        }
    })
    return recentCheckins
}

const parseCheckin = (checkin) => {
    const { venue, event } = checkin
    let createdDate = new Date(parseInt(checkin.createdAt) * 1000)
    let result = {
        id: checkin.id,
        date: formatISO(createdDate),
        timestamp: createdDate.getTime(),
        type: 'foursquare',
        title: venue.name,
        event: event && event.name ? event.name : null,
    }

    if (venue.location) {
        const { location } = venue
        result.lat = location.lat
        result.lng = location.lng
        result.city = location.city
        result.state = location.state
        result.country = location.cc
    }

    if (venue.categories && venue.categories.length > 0) {
        const category = venue.categories[0]
        result.category = category.shortName
        if (category.icon) {
            result.icon = `${category.icon.prefix}64${category.icon.suffix}`
        }
    }

    if (venue.id) {
        result.url = `https://foursquare.com/v/${venue.id}`
    }

    return result
}

exports.handler = async () => {
    const type = 'foursquare'
    const settings = await getSettings(AWS, AWS_REGION, type)
    const user = await fetchUser(settings)
    await storeUserInfo(AWS, AWS_REGION, type, user)

    const checkins = await fetchRecentCheckins(settings)
    await storeItems(AWS, AWS_REGION, type, checkins)
    console.log('Done!!')
}
