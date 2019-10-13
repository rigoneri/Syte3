import React, { Fragment, useState, useEffect } from 'react'
import styles from './Github.module.css'

export default function Profile() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch('http://localhost:4000/github/user')
            const user = await response.json()
            setUser(user)
        }
        fetchUser()
    }, [])

    return (
        <div className={styles.profile}>
            {user && (
                <Fragment>
                    <a href={user.url} className={styles.picture}>
                        <img src={user.picture} alt="Github Profile" />
                    </a>
                    <h2>{user.name}</h2>
                    <a href={user.url} className={styles.username}>
                        {user.username}
                    </a>
                    {user.description && <p>{user.description}</p>}
                    <ul className={styles.stats}>
                        <li>
                            Repos <strong>{user.repos}</strong>
                        </li>
                        <li>
                            Following <strong>{user.following}</strong>
                        </li>
                        <li>
                            Followers <strong>{user.followers}</strong>
                        </li>
                    </ul>
                </Fragment>
            )}
        </div>
    )
}
