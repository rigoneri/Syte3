import React from 'react'

type Props = { item: GitActivity }

export const TimelineItem = ({ item }: Props) => {
    if (!item.description) {
        return null
    }

    return <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
}
