const AWS = require('aws-sdk')
const AWS_REGION = process.env.AWS_REGION || 'us-east-1'
const fetch = require('node-fetch')
const parseISO = require('date-fns/parseISO')
const { getSettings, storeUserInfo, storeItems } = require('syte-common')
const {
    parseCreate,
    parseFork,
    parseIssues,
    parseIssueComment,
    parsePullRequest,
    parsePRComment,
    parsePush,
    parseRepo,
    parseWatch,
    parseRelease,
} = require('./activites')

const GITHUB_API = 'https://api.github.com/'
let headers
// note: we will not handle fetch errors since if will force the
// lambda to crash and we will get notified with the stacktrace.

const fetchUser = async (settings) => {
    console.log('Fetching user')
    const url = `${GITHUB_API}users/${settings.username}`
    const response = await fetch(url, { headers })
    if (!response.ok) {
        throw `API returned a ${response.status} status: ${response.statusText}`
    }

    const user = await response.json()
    return {
        id: user.id,
        name: user.name,
        username: user.username,
        picture: user.avatar_url,
        url: user.html_url,
        followers: user.followers || 0,
        following: user.following || 0,
        repos: [],
    }
}

const fetchRepos = async (settings) => {
    console.log('Fetching repos')
    const url = `${GITHUB_API}users/${settings.username}/repos?sort=updated`
    const response = await fetch(url, { headers })
    const repos = await response.json()

    let publicRepos = []
    repos.forEach((repo) => {
        if (!repo.private) {
            publicRepos.push({
                id: repo.id,
                name: repo.name,
                url: repo.html_url,
                updated: repo.updated_at,
                description: repo.description,
                fork: repo.fork,
                language: repo.language,
                forks: repo.forks_count,
                favorites: repo.watchers_count,
            })
        }
    })
    return publicRepos
}

const fetchRecentActivity = async (settings) => {
    console.log('Fetching Recent Activity')
    const url = `${GITHUB_API}users/${settings.username}/events/public`
    const response = await fetch(url, { headers })
    const result = await response.json()

    let recentActivity = []
    result.forEach((activity) => {
        let parsedActivity
        switch (activity.type) {
            case 'CreateEvent':
                parsedActivity = parseCreate(activity)
                break
            case 'ForkEvent':
                parsedActivity = parseFork(activity)
                break
            case 'IssuesEvent':
                parsedActivity = parseIssues(activity)
                break
            case 'IssueCommentEvent':
                parsedActivity = parseIssueComment(activity)
                break
            case 'PullRequestEvent':
                parsedActivity = parsePullRequest(activity)
                break
            case 'PullRequestReviewCommentEvent':
                parsedActivity = parsePRComment(activity)
                break
            case 'PushEvent':
                parsedActivity = parsePush(activity)
                break
            case 'RepositoryEvent':
                parsedActivity = parseRepo(activity)
                break
            case 'WatchEvent':
                parsedActivity = parseWatch(activity)
                break
            case 'ReleaseEvent':
                parsedActivity = parseRelease(activity)
                break
            default:
                break
        }

        if (parsedActivity) {
            parsedActivity.type = 'github'
            parsedActivity.timestamp = parseISO(parsedActivity.date).getTime()
            recentActivity.push(parsedActivity)
        }
    })

    return recentActivity
}

exports.handler = async () => {
    const type = 'github'
    const settings = await getSettings(AWS, AWS_REGION, type)
    headers = {
        'User-Agent': 'Syte',
        Authorization: `Bearer ${settings.token}`,
    }

    const user = await fetchUser(settings)
    const repos = await fetchRepos(settings)
    user.repos = repos
    await storeUserInfo(AWS, AWS_REGION, type, user)

    const recentActivity = await fetchRecentActivity(settings)
    await storeItems(AWS, AWS_REGION, type, recentActivity)
    console.log('Done!!')
}
