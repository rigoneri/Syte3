import React from 'react'
import Error from 'components/Error'
import useUser from 'hooks/User'
import Profile from './Profile'
import Shots from './Shots'

export default function Dribbble() {
    const [user, error] = useUser('dribbble')

    if (error) {
        return <Error message="Unable to fetch dribbble profile." />
    }

    return (
        <>
            {user && <Profile user={user} />}
            <Shots />
        </>
    )
}
