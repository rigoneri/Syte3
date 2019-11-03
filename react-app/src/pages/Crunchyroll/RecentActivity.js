import React, { useState, useEffect } from 'react'
import Activity from './Activity'
import styles from './Crunchyroll.module.css'

export default function RecentActivity() {
    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        fetchActivities()
    }, [])

    const fetchActivities = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/crunchyroll/recent`)
            const activities = await response.json()
            if (activities.length > 0) {
                setActivities(activities)
            }
            setLoading(false)
        } catch (error) {
            setError(true)
        }
    }

    return (
        <>
            <h3>Recently Watched</h3>
            <div className={styles.activities}>
                {error && <p className={styles.error}>Unable to fetch crunchyroll activity.</p>}
                {!loading && !activities.length && !error && <p className={styles.empty}>No recent activity.</p>}
                {!loading && !error && activities.length ? (
                    <ul>
                        {activities.map(activity => (
                            <Activity key={activity.id} activity={activity} />
                        ))}
                    </ul>
                ) : null}
            </div>
        </>
    )
}
