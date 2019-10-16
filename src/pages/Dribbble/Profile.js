import React from 'react'
import styles from './Dribbble.module.css'

export default function Profile({ user }) {
    return (
        <div className={styles.profile}>
            <a href={user.url} className={styles.picture}>
                <img src={user.picture} alt="Dribble Profile" />
            </a>
            <h2>{user.name}</h2>
            <a href={user.url} className={styles.username}>
                @{user.username}
            </a>
            {user.bio && user.bio.length && <p dangerouslySetInnerHTML={{ __html: user.bio }}></p>}
            <ul className={styles.stats}>
                <li>
                    Followers <strong>{user.followers}</strong>
                </li>
            </ul>
        </div>
    )
}
