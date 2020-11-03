const AWS = require('aws-sdk')
const AWS_REGION = process.env.AWS_REGION || 'us-east-1'
const fetch = require('node-fetch')
const formatISO = require('date-fns/formatISO')
const parseISO = require('date-fns/parseISO')
const { getSettings, storeSettings, storeUserInfo, storeItems } = require('syte-common')

const SPOTIFY_API_URL = 'https://api.spotify.com/v1/'
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
// note: we will not handle fetch errors since if will force the
// lambda to crash and we will get notified with the stacktrace.

const fetchUser = async (settings) => {
    console.log('Fetching user')
    const response = await fetch(`${SPOTIFY_API_URL}me`, {
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
        name: user.display_name,
        username: user.display_name,
        url: user.external_urls ? user.external_urls.spotify : null,
        picture: user.images ? user.images[0].url : null,
    }
}

const fetchRecentActivity = async (settings) => {
    console.log('Fetching Recent Activity')
    const url = `${SPOTIFY_API_URL}me/player/recently-played?limit=50`
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${settings.token}`,
        },
    })
    const { items } = await response.json()

    let recentTracks = []
    items.forEach(({ played_at, track }) => {
        let item = {
            title: track.name,
            url: track.external_urls ? track.external_urls.spotify : null,
            id: track.id,
            day: played_at.substring(0, 10),
            date: played_at,
            timestamp: parseISO(played_at).getTime(),
        }

        if (track.artists) {
            item.artist = track.artists[0].name
        }

        if (track.album) {
            if (track.album.images.length > 2) {
                item.image = track.album.images[2].url
            } else if (track.album.images.length > 1) {
                item.image = track.album.images[1].url
            } else {
                item.image = track.album.images[0].url
            }
        }

        if (track.preview_url) {
            item.preview_url = track.preview_url
        }

        recentTracks.push(item)
    })
    return recentTracks
}

const fetchTopTracks = async (settings) => {
    console.log('Fetching Top Tracks')
    const url = `${SPOTIFY_API_URL}me/top/tracks?limit=10&time_range=medium_term`
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${settings.token}`,
        },
    })
    const { items } = await response.json()

    let topTracks = []
    items.forEach((item, i) => {
        let track = {
            id: item.id,
            name: item.name,
            count: 0,
            url: item.external_urls.spotify,
            timestamp: i + 1,
        }

        if (item.artists) {
            track.artist = item.artists[0].name
        }

        if (item.album) {
            if (item.album.images.length > 1) {
                track.image = item.album.images[1].url
            } else {
                track.image = item.album.images[0].url
            }
        }

        if (item.preview_url) {
            track.preview_url = item.preview_url
        }

        topTracks.push(track)
    })
    return topTracks
}

const fetchTopArtists = async (settings) => {
    console.log('Fetching Top Artists')
    const url = `${SPOTIFY_API_URL}me/top/artists?limit=5&time_range=medium_term`
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${settings.token}`,
        },
    })
    const { items } = await response.json()

    let topArtists = []
    items.forEach((item, i) => {
        let artist = {
            id: item.id,
            name: item.name,
            count: 0,
            url: item.external_urls.spotify,
            genres: item.genres,
            timestamp: i + 1,
        }

        if (item.images) {
            if (item.images.length > 1) {
                artist.image = item.images[1].url
            } else {
                artist.image = item.images[0].url
            }
        }

        topArtists.push(artist)
    })
    return topArtists
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
    const url = SPOTIFY_TOKEN_URL

    const params = new URLSearchParams()
    params.append('grant_type', 'refresh_token')
    params.append('refresh_token', settings.refresh)

    const response = await fetch(url, {
        method: 'POST',
        body: params,
        headers: {
            Authorization: `Basic ${Buffer.from(settings.clientId + ':' + settings.clientSecret).toString('base64')}`,
        },
    })

    const result = await response.json()
    if (result.access_token) {
        settings.token = result.access_token
        settings.refresh = result.refresh_token ? result.refresh_token : settings.refresh
        settings.updated = formatISO(new Date())
        storeSettings(AWS, AWS_REGION, 'spotify', settings)
    }
}

exports.handler = async () => {
    const type = 'spotify'
    const settings = await getSettings(AWS, AWS_REGION, type)
    await ensureAuth(settings)

    const user = await fetchUser(settings)
    await storeUserInfo(AWS, AWS_REGION, type, user)

    const tracks = await fetchRecentActivity(settings)
    await storeItems(AWS, AWS_REGION, type, tracks)

    const topTracks = await fetchTopTracks(settings)
    await storeItems(AWS, AWS_REGION, 'toptracks', topTracks)

    const topArtists = await fetchTopArtists(settings)
    await storeItems(AWS, AWS_REGION, 'topartists', topArtists)

    console.log('Done!!')
}
