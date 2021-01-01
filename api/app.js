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

// Serving static content
app.use(
    express.static(path.join(__dirname, '/dist'), {
        lastModified: true,
        setHeaders: (res, path) => {
            console.log('path', path)
            if (path.endsWith('index.html')) {
                res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
            } else {
                res.set('Cache-control', 'public, max-age=86400')
            }
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

app.get('*', (_req, res) => {
    res.sendFile(__dirname + '/dist/index.html')
})

app.use((_req, res, _next) => {
    res.status(404)
    res.set('Cache-control', 'no-cache')
    res.send('404: File Not Found')
})

// Handling errors
app.use((err, _req, res, _next) => {
    console.error(err.stack)
    res.status(err.status || 500)
    res.set('Cache-control', 'no-cache')
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
