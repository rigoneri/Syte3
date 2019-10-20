import React, { useState, useEffect } from 'react'
import Error from 'components/Error'
import Profile from './Profile'
import Videos from './Videos'
import styles from './YouTube.module.css'

export default function YouTube() {
    const [user, setUser] = useState(null)
    const [error, setError] = useState(false)

    const fetchUser = async () => {
        try {
            const response = await fetch('http://localhost:4000/youtube/user')
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
        return <Error message="Unable to fetch youtube profile." />
    }

    return (
        <div className={styles.page}>
            {user && <Profile user={user} />}
            <Videos />
        </div>
    )
}
