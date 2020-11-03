import React from 'react'
import Img from 'react-image'
import styles from './Github.module.css'

const Profile = ({ user }) => {
    return (
        <div className={styles.profile}>
            <a href={user.url} className={styles.picture}>
                <Img src={user.picture} alt="Github Profile" />
            </a>
            <h2>{user.name}</h2>
            <a href={user.url} className={styles.username}>
                {user.username}
            </a>
            {user.description && user.description.length && <p>{user.description}</p>}
            <ul className={styles.stats}>
                <li>
                    Repos <strong>{user.repos.length}</strong>
                </li>
                <li>
                    Following <strong>{user.following ? user.following.toLocaleString() : '0'}</strong>
                </li>
                <li>
                    Followers <strong>{user.followers ? user.followers.toLocaleString() : '0'}</strong>
                </li>
            </ul>
        </div>
    )
}

export default Profile
