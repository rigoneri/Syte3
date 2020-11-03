import React from 'react'
import Img from 'react-image'
import styles from './YouTube.module.css'

const Profile = ({ user }) => {
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
                    <strong>{user.subscribers ? user.subscribers.toLocaleString() : '0'}</strong> Subscribers
                </li>
            </ul>
        </div>
    )
}

export default Profile
