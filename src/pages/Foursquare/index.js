import React, { useState, useEffect } from 'react'
import Error from 'components/Error'
import Profile from './Profile'
import Checkins from './Checkins'
import styles from './Foursquare.module.css'

export default function Foursquare() {
    const [user, setUser] = useState(null)
    const [error, setError] = useState(false)

    const fetchUser = async () => {
        try {
            const response = await fetch('http://localhost:4000/foursquare/user')
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
        return <Error message="Unable to fetch foursquare profile." />
    }

    return (
        <div className={styles.page}>
            {user && <Profile user={user} />}
            <Checkins />
        </div>
    )
}
