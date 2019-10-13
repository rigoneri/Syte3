import React from 'react'
import Profile from './Profile'
import Repos from './Repos'
import Activity from './Activity'
import styles from './Github.module.css'

export default function Github() {
    return (
        <div className={styles.page}>
            <Profile />
            <Repos />
            <Activity />
        </div>
    )
}
