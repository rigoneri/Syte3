import React from 'react'
import { PlayLogo } from 'components/Icons'
import styles from './Instagram.module.css'

export const TimelineItem = ({ item }) => {
    const handleClick = e => {
        e.preventDefault()
        console.log('TODO OPEN Modal', item)
    }

    return (
        <div className={styles.timelinePost}>
            <p dangerouslySetInnerHTML={{ __html: item.text }}></p>
            <a href={item.url} onClick={handleClick}>
                <span style={{ backgroundImage: `url(${item.pictureHD})` }} className={styles.picture} />
                {item.video && <PlayLogo className={styles.video} />}
            </a>
        </div>
    )
}
