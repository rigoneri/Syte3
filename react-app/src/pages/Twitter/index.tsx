import React from 'react'
import Error from 'components/Error'
import useUser from 'hooks/User'
import Profile from './Profile'
import Tweets from './Tweets'
import styles from './Twitter.module.css'

const Twitter = () => {
    const [user, error] = useUser<TwitterUser>('twitter')

    if (error) {
        return <Error message="Unable to fetch twitter profile." />
    }

    return (
        <div className={styles.page}>
            {user && <Profile user={user} />}
            <Tweets />
        </div>
    )
}

export default Twitter
