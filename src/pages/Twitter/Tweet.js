import React from 'react'
import { parseISO, formatDistanceToNow } from 'date-fns'
import { PlayLogo } from '../../components/Icons'
import styles from './Twitter.module.css'

export default function Tweet({ tweet }) {
    const handleClick = tweet => {
        console.log('TODO OPEN Modal', tweet)
    }

    return (
        <li>
            <a href={tweet.url} className={styles.avatar}>
                <img src={tweet.user.picture} alt="Avatar" />
            </a>
            <div className={styles.content}>
                <h4>
                    <a href={tweet.url}>
                        {tweet.user.name} <span className={styles.username}>@{tweet.user.username}</span>
                    </a>
                    <span className={styles.date}>{formatDistanceToNow(parseISO(tweet.date))} ago</span>
                </h4>
                <p dangerouslySetInnerHTML={{ __html: tweet.text }}></p>
                {tweet.pictures && (
                    <ul className={styles.pictures}>
                        {tweet.pictures.map(picture => (
                            <li key={picture.id} onClick={() => handleClick(tweet)}>
                                <span style={{ backgroundImage: `url(${picture.url})` }} className={styles.picture} />
                                {tweet.video && <PlayLogo className={styles.video} />}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </li>
    )
}
