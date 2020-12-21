import React, { useState, useEffect } from 'react'
import { subMonths, format } from 'date-fns'
import Img from 'react-image'
import { LeftIcon, RightIcon } from 'components/Icons'
import Map from './Map'
import styles from './Foursquare.module.css'

type Props = {
    checkins: FoursquareActivity[] | null
    month: number
    onMonthChange(month: number): void
}

type Dict = {
    [key: string]: any
}

const Monthly = ({ checkins, month, onMonthChange: changeMonth }: Props) => {
    const [categories, setCategories] = useState<Dict | null>(null)

    useEffect(() => {
        const groupedCheckins: Dict = {}
        if (checkins) {
            checkins.forEach(checkin => {
                const category = checkin.category
                if (!category) {
                    return
                }
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
    }, [checkins])

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
                    }}
                    data-testid="prev-month">
                    <LeftIcon />
                </span>
                {month > 0 && (
                    <span
                        className={styles.rightIcon}
                        onClick={() => {
                            changeMonth(month - 1)
                        }}
                        data-testid="next-month">
                        <RightIcon />
                    </span>
                )}
            </header>
            <section className={styles.map} data-testid="map">
                <Map markers={checkins} month={month} />
            </section>
            {categories ? (
                <section className={styles.categories}>
                    <ul>
                        {Object.values(categories)
                            .sort((a, b) => (a.count > b.count ? -1 : 1))
                            .map(category => (
                                <li key={category.category} data-testid="category">
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

export default Monthly
