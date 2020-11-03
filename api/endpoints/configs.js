const express = require('express')
const router = express.Router()
const AWS = require('aws-sdk')
const AWS_REGION = process.env.AWS_REGION || 'us-east-1'
const { getSettings, storeSettings, serviceParam } = require('syte-common')
const { restrict } = require('./utils')

router.param('service', serviceParam)

router.get('/:service', restrict, async (req, res) => {
    console.log('get service', req.service)
    const settings = await getSettings(AWS, AWS_REGION, req.service)
    res.set('Cache-control', 'no-cache')
    res.json(settings)
})

router.post('/:service', restrict, async (req, res) => {
    if (!req.session.user && !req.cookies.syte3auth) {
        res.status(401)
        res.json({})
        return
    }

    // We will assume it is safe and not validate since this is intended to run in dev only
    console.log('post service', req.service)
    try {
        await storeSettings(AWS, AWS_REGION, req.service, req.body)
        res.json({})
    } catch (error) {
        res.status(400)
        res.json({})
    }
})

module.exports = router
