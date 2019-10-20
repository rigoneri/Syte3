import React from 'react'
import Img from 'react-image'
import styles from './YouTube.module.css'

export default function Profile({ user }) {
    return (
        <div className={styles.profile}>
            <div className={styles.banner} style={{ backgroundImage: `url(${user.banner})` }}>
                <span className={styles.bannerShadow} />
            </div>
            <a href={user.url} className={styles.picture}>
                <Img src={user.picture} alt="YouTube Profile" />
            </a>
            <h2>{user.name}</h2>
            <ul className={styles.stats}>
                <li>
                    <strong>{user.subscribers}</strong> Subscribers
                </li>
            </ul>
        </div>
    )
}
