import React, { useState } from 'react'
import styles from './Dribbble.module.css'
import Modal from './Modal'

type Props = { item: DribbbleActivity }
type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent>

export const TimelineItem = ({ item }: Props) => {
    const [showDetails, setShowDetails] = useState(false)
    const handleClick = (e: ClickEvent) => {
        e.preventDefault()
        setShowDetails(!showDetails)
    }

    return (
        <div className={styles.timelinePost}>
            <p>{item.title}</p>
            <a href={item.url} onClick={handleClick}>
                <span style={{ backgroundImage: `url(${item.picture})` }} className={styles.picture} />
            </a>
            {showDetails && <Modal item={item} onClose={() => setShowDetails(false)} />}
        </div>
    )
}
