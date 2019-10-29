import React, { useState } from 'react'
import { PlayLogo } from 'components/Icons'
import Modal from './Modal'
import styles from './Instagram.module.css'

export const TimelineItem = ({ item }) => {
    const [showDetails, setShowDetails] = useState(false)
    const handleClick = e => {
        e.preventDefault()
        setShowDetails(!showDetails)
    }

    return (
        <div className={styles.timelinePost}>
            <p dangerouslySetInnerHTML={{ __html: item.text }}></p>
            <a href={item.url} onClick={handleClick}>
                <span style={{ backgroundImage: `url(${item.pictureHD})` }} className={styles.picture} />
                {item.video && <PlayLogo className={styles.video} />}
            </a>
            {showDetails && <Modal item={item} onClose={handleClick} />}
        </div>
    )
}
