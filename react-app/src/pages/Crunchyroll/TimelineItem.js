import React from 'react'
import styles from './Crunchyroll.module.css'

export const TimelineItem = ({ item }) => {
    return (
        <div className={styles.timelinePost}>
            <p>
                Watched <strong>{item.title}</strong> on Crunchyroll.
            </p>
            <p className={styles.description}>{item.description}</p>
            <a href={item.url}>
                <span style={{ backgroundImage: `url(${item.picture})` }} className={styles.picture} />
            </a>
        </div>
    )
}
