import React, { useState } from 'react'
import Img from 'react-image'
import { parseISO, formatDistanceToNow } from 'date-fns'
import { Logo, PlayLogo } from 'components/Icons'
import Modal from './Modal'
import styles from './YouTube.module.css'

const Video = ({ video }) => {
    const [videoVisible, setVideoVisible] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const handleClick = e => {
        e.preventDefault()
        setShowDetails(!showDetails)
    }

    return (
        <li>
            <a href={video.url} className={styles.video} onClick={handleClick}>
                <Img
                    src={video.image}
                    alt={video.title}
                    loader={
                        <div className={styles.placeholder}>
                            <Logo type="YouTube" />
                        </div>
                    }
                    onLoad={() => {
                        setVideoVisible(true)
                    }}
                />
                <span className={styles.videoLogo}>{videoVisible && <PlayLogo />}</span>
            </a>
            <div className={styles.info}>
                <div className={styles.title}>{video.title}</div>
                <div className={styles.date}>{formatDistanceToNow(parseISO(video.date))} ago</div>
            </div>
            {showDetails && <Modal item={video} onClose={handleClick} />}
        </li>
    )
}

export default Video
