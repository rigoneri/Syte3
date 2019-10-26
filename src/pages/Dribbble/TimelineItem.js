import React from 'react'
import styles from './Dribbble.module.css'

export const TimelineItem = ({ item }) => {
    const handleClick = e => {
        e.preventDefault()
        console.log('TODO OPEN Modal', item)
    }

    return (
        <div className={styles.timelinePost}>
            <p>{item.title}</p>
            <a href={item.url} onClick={handleClick}>
                <span style={{ backgroundImage: `url(${item.picture})` }} className={styles.picture} />
            </a>
        </div>
    )
}
