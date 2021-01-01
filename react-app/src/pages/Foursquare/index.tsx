import React from 'react'
import Error from 'components/Error'
import useUser from 'hooks/User'
import Profile from './Profile'
import Checkins from './Checkins'
import styles from './Foursquare.module.css'

const Foursquare = () => {
    const [user, error] = useUser<FoursquareUser>('foursquare')

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

export default Foursquare
