exports.restrict = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        res.status(401)
        res.json({ error: 'unauthenticated' })
    }
}
