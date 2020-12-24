import React from 'react'
import Img from 'react-image'
import pic from 'images/pic.jpg'
import styles from './Instagram.module.css'

type Props = { user: InstagramUser }

const Profile = ({ user }: Props) => {
    return (
        <div className={styles.profile}>
            <a href={user.url} className={styles.picture}>
                {user.picture ? (
                    <Img src={user.picture} alt="Instagram Profile" />
                ) : (
                    <img src={pic} width="65" height="60" alt="Instagram Profile" />
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
