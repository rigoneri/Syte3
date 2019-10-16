import React from 'react'
import styles from './Github.module.css'

export default function Profile({ user }) {
    return (
        <div className={styles.profile}>
            <a href={user.url} className={styles.picture}>
                <img src={user.picture} alt="Github Profile" />
            </a>
            <h2>{user.name}</h2>
            <a href={user.url} className={styles.username}>
                {user.username}
            </a>
            {user.description && user.description && <p>{user.description}</p>}
            <ul className={styles.stats}>
                <li>
                    Repos <strong>{user.repos}</strong>
                </li>
                <li>
                    Following <strong>{user.following}</strong>
                </li>
                <li>
                    Followers <strong>{user.followers}</strong>
                </li>
            </ul>
        </div>
    )
}
