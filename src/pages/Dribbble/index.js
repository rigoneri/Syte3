import React, { useState, useEffect } from 'react'
import Error from '../../components/Error'
import Profile from './Profile'
import Shots from './Shots'

export default function Github() {
    const [user, setUser] = useState(null)
    const [error, setError] = useState(false)

    const fetchUser = async () => {
        try {
            const response = await fetch('http://localhost:4000/dribbble/user')
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
        return <Error message="Unable to fetch dribbble profile." />
    }

    return (
        <div>
            {user && <Profile user={user} />}
            <Shots />
        </div>
    )
}
