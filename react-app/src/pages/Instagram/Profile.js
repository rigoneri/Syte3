import React from 'react'
import Img from 'react-image'
import styles from './Instagram.module.css'

export default function Profile({ user }) {
    return (
        <div className={styles.profile}>
            <a href={user.url} className={styles.picture}>
                <Img src={user.profile_picture} alt="Instagram Profile" />
            </a>
            <h2>{user.full_name}</h2>
            <a href={user.url} className={styles.username}>
                @{user.username}
            </a>
            {user.bio && user.bio.length && <p dangerouslySetInnerHTML={{ __html: user.bio }}></p>}
            <ul className={styles.stats}>
                <li>
                    Posts <strong>{user.counts.media ? user.counts.media.toLocaleString() : '0'}</strong>
                </li>
                <li>
                    Following <strong>{user.counts.follows ? user.counts.follows.toLocaleString() : '0'}</strong>
                </li>
                <li>
                    Followers <strong>{user.counts.followed_by ? user.counts.followed_by.toLocaleString() : '0'}</strong>
                </li>
            </ul>
        </div>
    )
}