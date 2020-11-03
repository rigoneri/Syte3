import React from 'react'
import Img from 'react-image'
import { parseISO, formatDistanceToNow } from 'date-fns'
import styles from './Foursquare.module.css'

const Checkin = ({ checkin }) => {
    return (
        <li className={styles.checkin}>
            <a href={checkin.url} className={styles.icon}>
                <Img src={checkin.icon} alt={checkin.title} />
            </a>
            <a href={checkin.url} className={styles.title}>
                {checkin.title}
            </a>
            <span className={styles.info}>
                <span className={styles.category}>{checkin.category}</span>&nbsp;
                <span className={styles.location}>
                    {checkin.city ? `${checkin.city}, ` : null}
                    {checkin.state}
                </span>
            </span>
            <span className={styles.date}>{formatDistanceToNow(parseISO(checkin.date))} ago</span>
        </li>
    )
}

export default Checkin
