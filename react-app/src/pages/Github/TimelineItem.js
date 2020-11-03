import React from 'react'

export const TimelineItem = ({ item }) => {
    if (!item.description) {
        return null
    }

    return <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
}
