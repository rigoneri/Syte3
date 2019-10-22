import React, { useState, useEffect } from 'react'
import { subMonths, format } from 'date-fns'
import Img from 'react-image'
import { LeftIcon, RightIcon } from 'components/Icons'
import styles from './Foursquare.module.css'

export default function Monthly({ checkins, month, onMonthChange: changeMonth }) {
    const [categories, setCategories] = useState(null)

    useEffect(() => {
        console.log('checkins', checkins)
        const groupedCheckins = {}
        if (checkins) {
            checkins.forEach(checkin => {
                const category = checkin.category
                if (groupedCheckins[category]) {
                    groupedCheckins[category].count += 1
                } else {
                    groupedCheckins[category] = {
                        count: 1,
                        icon: checkin.icon,
                        category,
                    }
                }
            })
        }

        setCategories(Object.keys(groupedCheckins).length > 0 ? groupedCheckins : null)
    }, [checkins, month])

    return (
        <div className={styles.monthly}>
            <header>
                <h2>{format(subMonths(new Date(), month), 'MMMM yyyy')}</h2>
                <span>
                    {checkins ? checkins.length : 0} {checkins && checkins.length === 1 ? 'Check-in' : 'Check-ins'}
                </span>
                <span
                    className={styles.leftIcon}
                    onClick={() => {
                        changeMonth(month + 1)
                    }}>
                    <LeftIcon />
                </span>
                {month > 0 && (
                    <span
                        className={styles.rightIcon}
                        onClick={() => {
                            changeMonth(month - 1)
                        }}>
                        <RightIcon />
                    </span>
                )}
            </header>
            <section className={styles.map}></section>
            {categories ? (
                <section className={styles.categories}>
                    <ul>
                        {Object.values(categories)
                            .sort((a, b) => (a.count > b.count ? -1 : 1))
                            .map(category => (
                                <li key={category.category}>
                                    <span className={styles.icon}>
                                        <Img src={category.icon} alt={category.category} />
                                    </span>
                                    <span className={styles.category}>{category.category}</span>
                                    <span className={styles.count}>
                                        {category.count} {category.count === 1 ? 'time' : 'times'}
                                    </span>
                                </li>
                            ))}
                    </ul>
                </section>
            ) : null}
        </div>
    )
}
