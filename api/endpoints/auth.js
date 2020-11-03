const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const formatISO = require('date-fns/formatISO')
const AWS = require('aws-sdk')
const AWS_REGION = process.env.AWS_REGION || 'us-east-1'
const { getSettings, storeSettings, serviceParam } = require('syte-common')
const { restrict } = require('./utils')

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'
const API_URL = process.env.API_URL || 'http://localhost:4000'

router.param('service', serviceParam)

router.get('/:service', restrict, async (req, res) => {
    res.set('Cache-control', 'no-cache')

    const settings = await getSettings(AWS, AWS_REGION, req.service)
    if (settings.oauthAuthUrl && settings.oauthTokenUrl && settings.clientId) {
        if (req.query.code) {
            const result = await updateAuth(settings, req.service, req.query.code)
            res.redirect(`${CLIENT_URL}/admin/${req.service}?result=${result}`)
            return
        }

        res.json({ url: oauthAuthUrl(settings, req.service) })
        return
    }

    res.json({})
})

const redirectURI = (service) => {
    return `${API_URL}/api/auth/${service}`
}

const oauthAuthUrl = (settings, service) => {
    let redirectURL = redirectURI(service)
    let url = `${settings.oauthAuthUrl}?client_id=${settings.clientId}&redirect_uri=${redirectURL}&response_type=code`
    if (settings.scope) {
        url += `&scope=${settings.scope}`
    }
    if (service === 'youtube') {
        url += '&access_type=offline&approval_prompt=force'
    }
    return url
}

const updateAuth = async (settings, service, code) => {
    const url = settings.oauthTokenUrl
    const params = new URLSearchParams()
    params.append('redirect_uri', redirectURI(service))
    params.append('grant_type', 'authorization_code')
    params.append('code', code)

    if (settings.scope) {
        params.append('scope', settings.scope)
    }

    let headers = {}
    if (service === 'instagram') {
        params.append('client_id', settings.clientId)
        params.append('client_secret', settings.clientSecret)
    } else {
        headers = {
            Authorization: `Basic ${Buffer.from(settings.clientId + ':' + settings.clientSecret).toString('base64')}`,
        }
    }

    const response = await fetch(url, {
        method: 'POST',
        body: params,
        headers: headers,
    })

    let result = {}
    const text = await response.text()
    try {
        // Attempting to parse JSON
        result = JSON.parse(text)
    } catch (err) {
        // Attempting to parse url params
        const responseParams = new URLSearchParams(text)
        result.access_token = responseParams.get('access_token')
    }

    if (result.access_token) {
        if (settings.oauthLongTokenUrl) {
            settings.token = await getLongLivedToken(settings, result.access_token)
        } else {
            settings.token = result.access_token
        }

        settings.refresh = result.refresh_token ? result.refresh_token : settings.refresh
        settings.updated = formatISO(new Date())
        await storeSettings(AWS, AWS_REGION, service, settings)
        return 'success'
    }

    return 'fail'
}

const getLongLivedToken = async (settings, token) => {
    const url = `${settings.oauthLongTokenUrl}&client_secret=${settings.clientSecret}&access_token=${token}`
    const response = await fetch(url)
    const text = await response.text()

    let result = {}
    try {
        result = JSON.parse(text)
    } catch (err) {
        console.error('Failed to parse long access token response')
    }

    return result.access_token || ''
}

module.exports = router
