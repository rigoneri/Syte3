import React from 'react'
import Img from 'react-image'
import styles from './Foursquare.module.css'

export default function Profile({ user }) {
    return (
        <div className={styles.profile}>
            <a href={user.url} className={styles.picture}>
                <Img src={user.picture} alt="Foursquare Profile" />
            </a>
            <h2>{user.name}</h2>
            <span className={styles.location}>{user.location}</span>
            <ul className={styles.stats}>
                <li>
                    Check-ins <strong>{user.checkins ? user.checkins.toLocaleString() : '0'}</strong>
                </li>
                <li>
                    Friends <strong>{user.friends ? user.friends.toLocaleString() : '0'}</strong>
                </li>
            </ul>
        </div>
    )
}
