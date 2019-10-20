import React, { useState, useEffect, useRef } from 'react'
import { parseISO, formatDistanceToNow } from 'date-fns'
import Img from 'react-image'
import styles from './Foursquare.module.css'

export default function Checkins() {
    const [checkins, setCheckins] = useState([])
    const [page, setPage] = useState(0)
    const [error, setError] = useState(false)
    const [empty, setEmpty] = useState(0)
    const pageEl = useRef(null)
    let debouncing = useRef(false)

    useEffect(() => {
        fetchCheckins()

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [page])

    const fetchCheckins = async () => {
        try {
            const response = await fetch(`http://localhost:4000/foursquare/${page}`)
            const pageCheckins = await response.json()
            if (pageCheckins.length > 0) {
                const chkins = checkins.slice()
                chkins.push(pageCheckins)
                setCheckins(chkins)
                setEmpty(0)
            } else if (empty < 2) {
                setEmpty(empty + 1)
                setPage(page + 1)
            }
            debouncing.current = false
        } catch (error) {
            setError(true)
        }
    }

    const handleScroll = () => {
        if (debouncing.current) {
            return
        }

        debouncing.current = true
        window.requestAnimationFrame(() => {
            if (window.scrollY + window.innerHeight > pageEl.current.clientHeight - 200) {
                setPage(page + 1)
                return
            }
            debouncing.current = false
        })
    }

    return (
        <div className={styles.checkins} ref={pageEl}>
            <h3>Recent Check-ins</h3>
            {error && <p className={styles.error}>Unable to fetch recent check-ins.</p>}
            {!error && (
                <ul>
                    {checkins.length &&
                        checkins.map(page =>
                            page.map(checkin => (
                                <li key={`${page}-${checkin.id}`}>
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
                            ))
                        )}
                </ul>
            )}
        </div>
    )
}
