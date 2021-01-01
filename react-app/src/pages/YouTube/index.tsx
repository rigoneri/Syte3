import React from 'react'
import Error from 'components/Error'
import useUser from 'hooks/User'
import Profile from './Profile'
import Videos from './Videos'
import styles from './YouTube.module.css'

const YouTube = () => {
    const [user, error] = useUser<YouTubeUser>('youtube')

    if (error) {
        return <Error message="Unable to fetch youtube profile." />
    }

    return (
        <div className={styles.page}>
            {user && <Profile user={user} />}
            <Videos />
        </div>
    )
}

export default YouTube
