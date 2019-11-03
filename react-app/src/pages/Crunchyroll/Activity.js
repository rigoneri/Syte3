import React from 'react'
import Img from 'react-image'
import { Logo } from 'components/Icons'
import { parseISO, formatDistanceToNow } from 'date-fns'
import styles from './Crunchyroll.module.css'

export default function Activity({ activity }) {
    return (
        <li>
            <a href={activity.url} className={styles.image}>
                <Img
                    src={activity.picture}
                    alt={activity.description}
                    loader={
                        <div className={styles.placeholder}>
                            <Logo type="Crunchyroll" />
                        </div>
                    }
                />
            </a>
            <div className={styles.detail}>
                <h4>{activity.title}</h4>
                <p className={styles.description}>{activity.description}</p>
                <span className={styles.date}>{formatDistanceToNow(parseISO(activity.date))} ago</span>
            </div>
        </li>
    )
}
