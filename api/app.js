const express = require('express')
const compression = require('compression')
const session = require('express-session')
const path = require('path')
const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(compression())
app.disable('x-powered-by')
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '/dist')))
app.use(
    session({
        key: 'syte3auth',
        resave: false,
        saveUninitialized: false,
        secret: process.env.SYTE3SESH,
        cookie: {
            httpOnly: false,
            sameSite: true,
            expires: 600000,
        },
    })
)

// Caching responses
app.use((req, res, next) => {
    if (req.method === 'GET') {
        res.set('Cache-control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=60')
    }

    next()
})

// API endpoints
app.use(require('./endpoints'))

// Everything else should take to react app
app.use(express.static(path.join(__dirname, '/dist')))
app.get('*', (_req, res) => {
    res.sendFile(__dirname + '/dist/index.html')
})

// Handling errors
app.use((err, _req, res, _next) => {
    console.error(err.stack)
    res.status(err.status || 500)
    res.send({
        message: err.message,
        error: {},
    })
})

app.listen(port, () => {
    if (process.env.NODE_ENV === 'production') {
        console.log = function () {}
    }

    console.log(`API available at http://localhost:${port}`)
})
