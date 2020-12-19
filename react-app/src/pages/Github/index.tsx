import React from 'react'
import Error from 'components/Error'
import useUser from 'hooks/User'
import Profile from './Profile'
import Repos from './Repos'
import Activities from './Activities'
import styles from './Github.module.css'

const Github = () => {
    const [user, error] = useUser<User>('github')

    if (error) {
        return <Error message="Unable to fetch github profile." />
    }

    return (
        <div className={styles.page}>
            {user && <Profile user={user} />}
            {user && <Repos repos={user.repos} />}
            <Activities />
        </div>
    )
}

export default Github
