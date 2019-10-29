import React from 'react'
import Error from 'components/Error'
import useUser from 'hooks/User'
import Profile from './Profile'
import Posts from './Posts'
import styles from './Instagram.module.css'

export default function Instagram() {
    const [user, error] = useUser('instagram')

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