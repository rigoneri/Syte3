import React from 'react'
import Error from 'components/Error'
import useUser from 'hooks/User'
import Profile from './Profile'
import RecentActivity from './RecentActivity'

export default function Crunchyroll() {
    const [user, error] = useUser('crunchyroll')

    if (error) {
        return <Error message="Unable to fetch crunchyroll profile." />
    }

    return (
        <>
            {user && <Profile user={user} />}
            <RecentActivity />
        </>
    )
}
