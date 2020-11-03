import React from 'react'
import Img from 'react-image'
import pic from 'images/pic.jpg'
import styles from './Instagram.module.css'

const Profile = ({ user }) => {
    return (
        <div className={styles.profile}>
            <a href={user.url} className={styles.picture}>
                {user.profile_picture ? (
                    <Img src={user.profile_picture} alt="Instagram Profile" />
                ) : (
                    <img src={pic} width="65" heigh="60" alt="Instagram Profile" />
                )}
            </a>
            <h2>{user.full_name}</h2>
            <a href={user.url} className={styles.username}>
                @{user.username}
            </a>
            <ul className={styles.stats}>
                <li>
                    Posts <strong>{user.counts.media ? user.counts.media.toLocaleString() : '0'}</strong>
                </li>
            </ul>
        </div>
    )
}

export default Profile
