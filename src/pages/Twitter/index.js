import React, { Fragment, useState, useEffect } from 'react'
import Loading from '../../components/Loading'
import Profile from './Profile'
import Photos from './Photos'
import Tweets from './Tweets'
import styles from './Twitter.module.css'

export default function Twitter() {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch('http://localhost:4000/twitter/user')
            const user = await response.json()
            setUser(user)
            setLoading(false)
        }
        fetchUser()
    }, [])

    return (
        <Fragment>
            {loading ? (
                <Loading />
            ) : (
                <div className={styles.page}>
                    <div className={styles.profile}>
                        <Profile user={user} />
                        {user.pictures && <Photos username={user.username} photos={user.pictures} />}
                    </div>
                    <Tweets />
                </div>
            )}
        </Fragment>
    )
}
