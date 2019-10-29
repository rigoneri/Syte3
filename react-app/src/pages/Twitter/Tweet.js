import React, { useState } from 'react'
import Img from 'react-image'
import { parseISO, formatDistanceToNow } from 'date-fns'
import { PlayLogo } from 'components/Icons'
import Modal from './Modal'
import styles from './Twitter.module.css'

export default function Tweet({ tweet }) {
    const [showDetails, setShowDetails] = useState(false)
    const handleClick = e => {
        e.preventDefault()
        setShowDetails(!showDetails)
    }

    return (
        <li>
            <a href={tweet.url} className={styles.avatar}>
                <Img src={tweet.user.picture} alt="Avatar" />
            </a>
            <div className={styles.content}>
                <h4>
                    <a href={tweet.url}>
                        {tweet.user.name} <span className={styles.username}>@{tweet.user.username}</span>
                    </a>
                    <span className={styles.date}>{formatDistanceToNow(parseISO(tweet.date))} ago</span>
                </h4>
                <p dangerouslySetInnerHTML={{ __html: tweet.originalText ? tweet.originalText : tweet.text }}></p>
                {tweet.pictures && (
                    <ul className={styles.pictures}>
                        {tweet.pictures.map(picture => (
                            <li key={picture.id} onClick={handleClick}>
                                <span style={{ backgroundImage: `url(${picture.url})` }} className={styles.picture} />
                                {tweet.video && <PlayLogo className={styles.video} />}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {showDetails && <Modal item={tweet} onClose={handleClick} />}
        </li>
    )
}