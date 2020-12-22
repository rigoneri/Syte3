import React from 'react'
import Error from 'components/Error'
import useUser from 'hooks/User'
import Profile from './Profile'
import Shots from './Shots'

const Dribbble = () => {
    const [user, error] = useUser<DribbbleUser>('dribbble')

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

export default Dribbble
