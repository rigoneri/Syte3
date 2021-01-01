import React, { useState, useEffect } from 'react'
import Activity from './Activity'
import styles from './Github.module.css'

const Activities = () => {
    const [activities, setActivities] = useState<GitActivity[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await fetch(`/api/github/activity`)
                const result = await response.json()
                setLoading(false)
                setActivities(result.data)
            } catch (error) {
                setLoading(false)
                setError(true)
            }
        }
        fetchActivities()
    }, [])

    return (
        <div className={styles.activities}>
            <h3>Recent Activity</h3>
            {loading && <p>Loading...</p>}
            {!loading && error && <p className={styles.error}>Unable to fetch recent activity.</p>}
            {!loading && !activities.length && !error && <p className={styles.empty}>No recent activity.</p>}
            {activities.length ? (
                <ul>
                    {activities.map(activity => (
                        <Activity key={activity.id} activity={activity} />
                    ))}
                </ul>
            ) : null}
        </div>
    )
}

export default Activities
