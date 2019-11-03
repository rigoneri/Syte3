import React, { useState } from 'react'
import { PlayLogo } from 'components/Icons'
import styles from './YouTube.module.css'
import Modal from './Modal'

export const TimelineItem = ({ item }) => {
    const [showDetails, setShowDetails] = useState(false)
    const handleClick = e => {
        e.preventDefault()
        setShowDetails(!showDetails)
    }

    return (
        <div className={styles.timelinePost}>
            <h4>{item.type === 'youtube-like' ? 'Liked on YouTube' : 'Posted to YouTube'}</h4>
            <p>{item.title}</p>
            <a href={item.url} onClick={handleClick}>
                <span style={{ backgroundImage: `url(${item.image})` }} className={styles.picture} />
                <PlayLogo className={styles.video} />
            </a>
            {showDetails && <Modal item={item} onClose={handleClick} />}
        </div>
    )
}
