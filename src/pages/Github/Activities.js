import React, { useState, useEffect } from 'react'
import Activity from './Activity'
import styles from './Github.module.css'

export default function Activities() {
    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        fetchActivities()
    }, [])

    const fetchActivities = async () => {
        try {
            const response = await fetch('http://localhost:4000/github/activity')
            const activities = await response.json()
            setLoading(false)
            setActivities(activities)
        } catch (error) {
            setLoading(false)
            setError(true)
        }
    }

    return (
        <div className={styles.activities}>
            <h3>Recent Activity</h3>
            {loading && <p>Loading...</p>}
            {!loading && error && <p className={styles.error}>Unable to fetch recent activity.</p>}
            {!loading && !activities.length && !error && <p className={styles.empty}>No recent activity.</p>}
            {!loading && activities.length ? (
                <ul>
                    {activities.map(activity => (
                        <Activity key={activity.id} activity={activity} />
                    ))}
                </ul>
            ) : null}
        </div>
    )
}
