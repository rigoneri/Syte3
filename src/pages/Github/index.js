import React, { useState, useEffect } from 'react'
import Error from 'components/Error'
import Profile from './Profile'
import Repos from './Repos'
import Activities from './Activities'
import styles from './Github.module.css'

export default function Github() {
    const [user, setUser] = useState(null)
    const [error, setError] = useState(false)

    const fetchUser = async () => {
        try {
            const response = await fetch('http://localhost:4000/github/user')
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
        return <Error message="Unable to fetch github profile." />
    }

    return (
        <div className={styles.page}>
            {user && <Profile user={user} />}
            <Repos />
            <Activities />
        </div>
    )
}
