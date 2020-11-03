const express = require('express')
const router = express.Router()
const parseISO = require('date-fns/parseISO')
const { format } = require('date-fns-tz')
const { getActivityByRange } = require('./activity')

router.get('/', async (req, res) => {
    if (!req.query.start && !req.query.end) {
        res.json({})
    }

    const responses = await Promise.all([
        getGroupedSpotifyActivity(req.query.start, req.query.end),
        getActivityByRange('twitter', req.query.start, req.query.end),
        getActivityByRange('foursquare', req.query.start, req.query.end),
        getActivityByRange('github', req.query.start, req.query.end),
        getActivityByRange('youtube-likes', req.query.start, req.query.end),
        getActivityByRange('youtube-uploads', req.query.start, req.query.end),
        getActivityByRange('dribbble', req.query.start, req.query.end),
    ])

    let result = []
    responses.forEach((response) => {
        result = result.concat(response.data || [])
    })

    result.sort((a, b) => (a.date < b.date ? 1 : -1))

    res.json({
        data: result,
    })
})

const getGroupedSpotifyActivity = async (start, end) => {
    const result = await getActivityByRange('spotify', start, end)
    if (!result.data) {
        return {}
    }

    let uniqueTracksByDay = {}
    result.data.forEach((track) => {
        const { id, date } = track
        const day = format(parseISO(date), 'yyyy-MM-dd', 'America/Chicago')

        let count = 1
        if (uniqueTracksByDay[day] && uniqueTracksByDay[day][id]) {
            count = uniqueTracksByDay[day][id].count + 1
        }

        if (!uniqueTracksByDay[day]) {
            uniqueTracksByDay[day] = {}
        }

        uniqueTracksByDay[day][id] = {
            count,
            track,
        }
    })

    let spotifyTracks = []
    Object.entries(uniqueTracksByDay).forEach(([day, dayTracks]) => {
        let plays = Object.keys(dayTracks).length
        let date = null
        let tracks = Object.values(dayTracks)
            .sort((a, b) => (a.count < b.count ? 1 : -1))
            .slice(0, 6)
            .map(({ track }) => {
                if (!date) {
                    date = track.date
                }
                return {
                    id: track.id,
                    title: track.title,
                    artist: track.artist,
                    image: track.image,
                    url: track.url,
                    preview_url: track.preview_url,
                }
            })

        spotifyTracks.push({
            type: 'spotify',
            id: `spotify-${date}`,
            plays,
            tracks,
            date,
        })
    })

    return { data: spotifyTracks }
}

module.exports = router
