import React, { useState } from 'react'
import { PlayLogo } from 'components/Icons'
import Modal from './Modal'
import styles from './Instagram.module.css'

type Props = { item: InstagramActivity }
type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent>

export const TimelineItem = ({ item }: Props) => {
    const [showDetails, setShowDetails] = useState(false)
    const handleClick = (e: ClickEvent) => {
        e.preventDefault()
        setShowDetails(!showDetails)
    }

    return (
        <div className={styles.timelinePost}>
            <p dangerouslySetInnerHTML={{ __html: item.text }}></p>
            <a href={item.url} onClick={handleClick}>
                <span style={{ backgroundImage: `url(${item.picture})` }} className={styles.picture} />
                {item.video && <PlayLogo role="img" className={styles.video} />}
            </a>
            {showDetails && <Modal item={item} onClose={() => setShowDetails(false)} />}
        </div>
    )
}
