import React from 'react'
import Error from 'components/Error'
import useUser from 'hooks/User'
import Profile from './Profile'
import Videos from './Videos'
import styles from './YouTube.module.css'

export default function YouTube() {
    const [user, error] = useUser('youtube')

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
