import React from 'react'
import { Icon } from 'components/Icons'
import styles from './Home.module.css'

export default function TimelineItem({ item }) {
    return (
        <li>
            {!['lastfm', 'spotify'].includes(item.type) ? <h3>{item.time}</h3> : null}
            <span className={styles.icon}>
                <Icon type={item.type} />
            </span>
            <div className={styles.content}>content....</div>
        </li>
    )
}
