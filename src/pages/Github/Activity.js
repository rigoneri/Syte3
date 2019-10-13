import React, { useState, useEffect } from 'react'
import { parseISO, formatDistanceToNow } from 'date-fns'
import { GitIcons } from '../../components/Icons'
import styles from './Github.module.css'

export default function Activity() {
    const [loading, setLoading] = useState(true)
    const [activities, setActivities] = useState([])

    useEffect(() => {
        const fetchActivity = async () => {
            const response = await fetch('http://localhost:4000/github/activity')
            const activities = await response.json()
            setActivities(activities)
            setLoading(false)
        }

        fetchActivity()
    }, [])

    return (
        <div className={styles.activities}>
            <h3>Recent Activity</h3>
            {loading && <p>Loading...</p>}
            {!loading && !activities.length && <p>No recent activity.</p>}
            {!loading && activities.length && (
                <ul>
                    {activities.map(activity => (
                        <li key={activity.id}>
                            <GitIcons type={activity.icon} />
                            <div className={styles.detail}>
                                <p dangerouslySetInnerHTML={{ __html: activity.description }}></p>
                                {activity.comment && <p dangerouslySetInnerHTML={{ __html: activity.comment }} className={styles.comment}></p>}
                                <span className={styles.date}>{formatDistanceToNow(parseISO(activity.date))} ago</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
