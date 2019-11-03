import React from 'react'
import Img from 'react-image'
import styles from './Crunchyroll.module.css'

export default function Profile({ user }) {
    return (
        <div className={styles.profile}>
            <a href={user.url} className={styles.picture}>
                <Img src={user.picture} alt="Crunchyroll Profile" />
            </a>
            <h2>{user.username}</h2>
        </div>
    )
}
