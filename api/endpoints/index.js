const express = require('express')
const router = express.Router()
const AWS = require('aws-sdk')
const AWS_REGION = process.env.AWS_REGION || 'us-east-1'
const { getUserInfo, serviceParam } = require('syte-common')
const { getActivity, getActivityByRange } = require('./activity')

router.param('service', serviceParam)

router.use('/healthcheck', (_req, res, _next) => {
    res.send('ok')
})

router.use('/api/configs', require('./configs'))
router.use('/api/auth', require('./auth'))
router.use('/api/timeline', require('./timeline'))

router.post('/api/login', (req, res, _next) => {
    const { password } = req.body
    if (process.env.SYTE3ADMIN && process.env.SYTE3ADMIN === password) {
        req.session.regenerate(() => {
            req.session.user = 'ok'
            res.send({ success: true })
        })
        return
    }

    res.status(400)
    res.send({ error: 'invalid' })
})

router.get('/api/logout', (req, res, next) => {
    if (req.session.user) {
        req.session.destroy(function () {
            res.clearCookie('syte3auth')
            res.json({ success: true })
        })
    } else {
        next()
    }
})

router.get('/api/:service/user', async (req, res) => {
    const user = await getUserInfo(AWS, AWS_REGION, req.service)
    res.json(user)
})

router.get('/api/:service/activity', async (req, res) => {
    let result = {}
    if (req.query.start && req.query.end) {
        result = await getActivityByRange(req.service, req.query.start, req.query.end)
    } else {
        result = await getActivity(req.service, req.query.page, req.query.limit)
    }
    res.json(result)
})

router.get('/api/spotify/top', async (_req, res) => {
    const topTracks = await getActivity('toptracks')
    const topArtists = await getActivity('topartists')
    res.json({
        tracks: topTracks.data ? topTracks.data.reverse() : [],
        artists: topArtists.data ? topArtists.data.reverse() : [],
    })
})

module.exports = router
