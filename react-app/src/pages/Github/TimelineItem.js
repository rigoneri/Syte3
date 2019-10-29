import React from 'react'

export const TimelineItem = ({ item }) => {
    return (
        <p>
            Pushed{' '}
            <strong>
                {item.commits} {item.commits === 1 ? 'commit' : 'commits'}
            </strong>{' '}
            to {item.repo ? <a href={item.repo_url}>{item.repo}</a> : 'a private repo'} on Github.
        </p>
    )
}
