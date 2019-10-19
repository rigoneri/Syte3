import React, { useState, useEffect } from 'react'
import Profile from './Profile'
import Tweets from './Tweets'
import Error from 'components/Error'
import styles from './Twitter.module.css'

export default function Twitter() {
    const [user, setUser] = useState(null)
    const [error, setError] = useState(false)

    const fetchUser = async () => {
        try {
            const response = await fetch('http://localhost:4000/twitter/user')
            const user = await response.json()
            setUser(user)
        } catch (error) {
            setError(true)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

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
