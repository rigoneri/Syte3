import React from 'react'
import Img from 'react-image'
import styles from './Dribbble.module.css'

const Profile = ({ user }) => {
    return (
        <div className={styles.profile}>
            <a href={user.url} className={styles.picture}>
                <Img src={user.picture} alt="Dribble Profile" />
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

export default Profile
