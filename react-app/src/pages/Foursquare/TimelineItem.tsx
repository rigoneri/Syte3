import React from 'react'
import Img from 'react-image'
import styles from './Foursquare.module.css'

type Props = { item: FoursquareActivity }

export const TimelineItem = ({ item }: Props) => {
    return (
        <div className={styles.checkin}>
            <a href={item.url} className={styles.icon}>
                <Img src={item.icon} alt={item.title} />
            </a>
            <a href={item.url} className={styles.title}>
                {item.title}
            </a>
            <span className={styles.info}>
                <span className={styles.category}>{item.category}</span>&nbsp;
                <span className={styles.location}>
                    {item.city ? `${item.city}, ` : null}
                    {item.state}
                </span>
            </span>
        </div>
    )
}
