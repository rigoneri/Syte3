import React from 'react'
import { parseISO, formatDistanceToNow } from 'date-fns'
import { GitIcons } from 'components/Icons'
import styles from './Github.module.css'

type Props = { activity: GitActivity }

const Activity = ({ activity }: Props) => {
    return (
        <li>
            <GitIcons type={activity.icon} />
            <div className={styles.detail}>
                <p dangerouslySetInnerHTML={{ __html: activity.description }}></p>
                {activity.comment && (
                    <p dangerouslySetInnerHTML={{ __html: activity.comment }} className={styles.comment}></p>
                )}
                <span className={styles.date}>{formatDistanceToNow(parseISO(activity.date))} ago</span>
            </div>
        </li>
    )
}

export default Activity
