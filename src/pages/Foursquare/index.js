import React from 'react'
import Error from 'components/Error'
import useUser from 'hooks/User'
import Profile from './Profile'
import Checkins from './Checkins'
import styles from './Foursquare.module.css'

export default function Foursquare() {
    const [user, error] = useUser('foursquare')

    if (error) {
        return <Error message="Unable to fetch foursquare profile." />
    }

    return (
        <div className={styles.page}>
            {user && <Profile user={user} />}
            <Checkins />
        </div>
    )
}
