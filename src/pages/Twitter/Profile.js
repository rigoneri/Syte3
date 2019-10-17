import React from 'react'
import Photos from './Photos'
import Img from 'react-image'
import styles from './Twitter.module.css'

export default function Profile({ user }) {
    return (
        <div className={styles.profile}>
            <div className={styles.banner} style={{ backgroundImage: `url(${user.banner})` }}>
                <span className={styles.bannerShadow} />
            </div>
            <a href={user.url} className={styles.picture}>
                <Img src={user.picture} alt="Twitter Profile" />
            </a>
            <h2>{user.name}</h2>
            <a href={user.url} className={styles.username}>
                @{user.username}
            </a>
            {user.description && user.description.length && <p>{user.description}</p>}
            <ul className={styles.stats}>
                <li>
                    Tweets <strong>{user.statuses}</strong>
                </li>
                <li>
                    Following <strong>{user.following}</strong>
                </li>
                <li>
                    Followers <strong>{user.followers}</strong>
                </li>
            </ul>
            {user.pictures && <Photos username={user.username} photos={user.pictures} />}
        </div>
    )
}
