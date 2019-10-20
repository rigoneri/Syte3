import React, { useState, useEffect } from 'react'
import Error from 'components/Error'
import Profile from './Profile'
import Posts from './Posts'
import styles from './Instagram.module.css'

export default function Instagram() {
    const [user, setUser] = useState(null)
    const [error, setError] = useState(false)

    const fetchUser = async () => {
        try {
            const response = await fetch('http://localhost:4000/instagram/user')
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
        return <Error message="Unable to fetch instagram profile." />
    }

    return (
        <>
            {user && <Profile user={user} />}
            <Posts />
            {user && (
                <a href={user.url} className={styles.more}>
                    See more on Instagram...
                </a>
            )}
        </>
    )
}
