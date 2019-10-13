import React, { Fragment } from 'react'
import styles from './Twitter.module.css'

export default function Profile({ user }) {
    return (
        <Fragment>
            <div className={styles.banner}>
                <img src={user.banner} alt="Banner" />
                <span className={styles.bannerShadow} />
            </div>
            <a href={user.url} className={styles.picture}>
                <img src={user.picture} alt="Twitter Profile" />
            </a>
            <h2>{user.name}</h2>
            <a href={user.url} className={styles.username}>
                @{user.username}
            </a>
            {user.description && <p>{user.description}</p>}
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
        </Fragment>
    )
}
