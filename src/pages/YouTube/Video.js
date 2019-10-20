import React, { useState } from 'react'
import Img from 'react-image'
import { parseISO, formatDistanceToNow } from 'date-fns'
import { Logo, PlayLogo } from 'components/Icons'
import styles from './YouTube.module.css'

export default function Video({ video }) {
    const [videoVisible, setVideoVisible] = useState(false)
    const handleClick = e => {
        e.preventDefault()
        console.log('TODO OPEN Modal', video)
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
        </li>
    )
}
