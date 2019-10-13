import React, { Fragment, useState, useEffect } from 'react'
import Loading from '../../components/Loading'
import Profile from './Profile'
import Tweets from './Tweets'
import styles from './Twitter.module.css'

export default function Twitter() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch('http://localhost:4000/twitter/user')
            const user = await response.json()
            setUser(user)
        }
        fetchUser()
    }, [])

    return (
        <Fragment>
            <div className={styles.page}>
                {user && <Profile user={user} />}
                <Tweets />
            </div>
        </Fragment>
    )
}
