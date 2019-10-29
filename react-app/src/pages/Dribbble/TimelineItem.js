import React, { useState } from 'react'
import styles from './Dribbble.module.css'
import Modal from './Modal'

export const TimelineItem = ({ item }) => {
    const [showDetails, setShowDetails] = useState(false)
    const handleClick = e => {
        e.preventDefault()
        setShowDetails(!showDetails)
    }

    return (
        <div className={styles.timelinePost}>
            <p>{item.title}</p>
            <a href={item.url} onClick={handleClick}>
                <span style={{ backgroundImage: `url(${item.picture})` }} className={styles.picture} />
            </a>
            {showDetails && <Modal item={item} onClose={handleClick} />}
        </div>
    )
}
