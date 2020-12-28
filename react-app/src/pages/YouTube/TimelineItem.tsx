import React, { useState } from 'react'
import { PlayLogo } from 'components/Icons'
import styles from './YouTube.module.css'
import Modal from './Modal'

type Props = { item: YouTubeActivity }
type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent>

export const TimelineItem = ({ item }: Props) => {
    const [showDetails, setShowDetails] = useState(false)
    const handleClick = (e: ClickEvent) => {
        e.preventDefault()
        setShowDetails(!showDetails)
    }

    return (
        <div className={styles.timelinePost}>
            <h4>{item.type === 'youtube-like' ? 'Liked on YouTube' : 'Posted to YouTube'}</h4>
            <p>{item.title}</p>
            <a href="/youtube" onClick={handleClick}>
                <span style={{ backgroundImage: `url(${item.image})` }} className={styles.picture} role="img" />
                <PlayLogo className={styles.video} />
            </a>
            {showDetails && <Modal item={item} onClose={() => setShowDetails(false)} />}
        </div>
    )
}
