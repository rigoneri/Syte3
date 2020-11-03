const markdown = require('markdown').markdown

exports.parseCreate = (activity) => {
    const { payload, repo } = activity
    const result = {
        id: activity.id,
        date: activity.created_at,
    }

    if (payload.ref_type === 'branch') {
        result.icon = 'git-branch'
        result.description = 'Created a branch '
    } else if (payload.ref_type === 'repository') {
        result.icon = 'git-repo'
        result.description = 'Created a repository '
    } else if (payload.ref_type === 'tag') {
        result.icon = 'git-tag'
        result.description = 'Created tag '
    }

    if (result.icon && result.description) {
        if (payload.ref) {
            if (payload.ref_type !== 'tag') {
                result.description += 'called '
            }
            result.description += `<strong>${payload.ref}</strong> `
        }

        if (repo) {
            result.description += `at <a href="${repo.url}" target="_blank">${repo.name}</a>`
        }

        return result
    }
}

exports.parseFork = (activity) => {
    const { payload, repo } = activity
    const result = {
        id: activity.id,
        date: activity.created_at,
        icon: 'git-branch',
        description: 'Forked ',
    }

    if (repo) {
        result.description += `<a href="https://github.com/${repo.name}" target="_blank">${repo.name}</a> `
    }

    if (payload && payload.forkee) {
        result.description += `to <a href="${payload.forkee.html_url}" target="_blank">${payload.forkee.full_name}</a>`
    }

    return result
}

exports.parseIssues = (activity) => {
    const { payload, repo } = activity
    const result = {
        id: activity.id,
        date: activity.created_at,
    }

    if (payload.action === 'opened') {
        result.icon = 'git-issue'
        result.description = 'Opened issue '
    } else if (payload.action === 'closed') {
        result.icon = 'git-issue-closed'
        result.description = 'Closed issue '
    } else if (payload.action === 'reopened') {
        result.icon = 'git-issue-reopen'
        result.description = 'Reopened issue '
    }

    if (result.description) {
        result.description += `<a href="${payload.issue.html_url}" target="_blank">`

        if (repo) {
            result.description += repo.name
        }

        result.description += `#${payload.issue.number}</a>`

        if (payload.issue.title) {
            result.comment = payload.issue.title
        }

        return result
    }
}

exports.parseIssueComment = (activity) => {
    if (activity.payload.action !== 'created') {
        return
    }

    const { payload, repo } = activity
    const result = {
        id: activity.id,
        date: activity.created_at,
        icon: 'comment',
        description: 'Commented on issue ',
    }

    result.description += `<a href="${payload.issue.html_url}" target="_blank">`

    if (repo) {
        result.description += repo.name
    }

    result.description += `#${payload.issue.number}</a>`

    if (payload.comment) {
        result.comment = markdown.toHTML(payload.comment.body.substring(0, 100) + '...')
    }

    return result
}

exports.parsePullRequest = (activity) => {
    const { payload, repo } = activity
    const result = {
        id: activity.id,
        date: activity.created_at,
    }

    if (payload.action == 'opened') {
        result.icon = 'git-pull'
        result.description = 'Opened a pull request '
    } else if (payload.action == 'closed') {
        result.icon = 'git-pull'
        result.description = 'Closed pull request '
        if (payload.pull_request.merged) {
            result.icon = 'git-merge'
            result.description = 'Merged pull request '
        }
    }

    if (result.description) {
        result.description += `<a href="${payload.pull_request.html_url}" target="_blank">`

        if (repo) {
            result.description += repo.name
        }
        result.description += '#' + payload.pull_request.number + '</a>'
        result.comment = payload.pull_request.title
        return result
    }
}

exports.parsePRComment = (activity) => {
    const { payload, repo } = activity
    if (payload.action !== 'created') {
        return
    }

    const result = {
        id: activity.id,
        date: activity.created_at,
        icon: 'comment',
        description: 'Commented on pull request ',
    }

    result.description += `<a href="${payload.pull_request.html_url}" target="_blank`

    if (repo) {
        result.description += repo.name
    }

    result.description += '#' + payload.pull_request.number + '</a>'

    if (payload.comment) {
        result.comment = markdown.toHTML(payload.comment)
    }

    return result
}

exports.parsePush = (activity) => {
    const { payload, repo } = activity
    const result = {
        id: activity.id,
        date: activity.created_at,
        icon: 'git-commit',
        description: 'Pushed ',
    }

    if (payload.size) {
        result.description += payload.size + (payload.size == 1 ? ' commit ' : ' commits ')
    }

    if (payload.ref) {
        result.description += `to <strong>${payload.ref.replace(/refs\/heads\//g, '')}</strong> `
    }

    if (repo) {
        result.description += `at <a href="https://github.com/${repo.name}" target="_blank">${repo.name}</a> `
    }

    return result
}

exports.parseRepo = (activity) => {
    const { payload } = activity
    if (payload.action !== 'created') {
        return
    }

    const result = {
        id: activity.id,
        date: activity.created_at,
        icon: 'git-repo',
        description: 'Create a new repository ',
    }

    if (payload.repository) {
        result.description += `at <a href="${payload.repository.html_url}" target="_blank">${payload.repository.full_name}</a> `
    }

    return result
}

exports.parseWatch = (activity) => {
    const result = {
        id: activity.id,
        date: activity.created_at,
        icon: 'star',
        description: 'Starred ',
    }

    if (activity.repo) {
        result.description += `<a href="${activity.repo.url}" target="_blank">${activity.repo.name}</a> `
    }

    return result
}

exports.parseRelease = (activity) => {
    const { payload } = activity
    const result = {
        id: activity.id,
        date: activity.created_at,
        icon: 'git-tag',
        description: 'Released ',
    }

    if (payload.release) {
        result.description += `<a href="${payload.release.html_url}" target="_blank">${payload.release.tag_name}</a> `
    }

    if (payload.repository) {
        result.description += `at <a href="${payload.repository.html_url}" target="_blank">${payload.repository.full_name}</a> `
    }

    return result
}
