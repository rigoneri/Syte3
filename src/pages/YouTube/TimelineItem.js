import React from 'react'
import { PlayLogo } from 'components/Icons'
import styles from './YouTube.module.css'

export const TimelineItem = ({ item }) => {
    const handleClick = e => {
        e.preventDefault()
        console.log('TODO OPEN Modal', item)
    }

    return (
        <div className={styles.timelinePost}>
            <p>{item.title}</p>
            <a href={item.url} onClick={handleClick}>
                <span style={{ backgroundImage: `url(${item.image})` }} className={styles.picture} />
                <PlayLogo className={styles.video} />
            </a>
        </div>
    )
}
