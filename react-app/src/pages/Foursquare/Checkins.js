import React, { useState, useEffect, useRef } from 'react'
import Monthly from './Monthly'
import Checkin from './Checkin'
import { startOfMonth, endOfMonth, subMonths } from 'date-fns'
import styles from './Foursquare.module.css'

const Checkins = () => {
    const [checkins, setCheckins] = useState([])
    const [page, setPage] = useState(0)
    const [error, setError] = useState(false)
    const [empty, setEmpty] = useState(0)
    const [month, setMonth] = useState(0)
    const [loadingMonth, setLoadingMonth] = useState(false)
    const pageEl = useRef(null)
    let debouncing = useRef(false)

    useEffect(() => {
        const fetchCheckins = async () => {
            try {
                let date = subMonths(new Date(), page)
                let start = startOfMonth(date).getTime()
                let end = endOfMonth(date).getTime()

                const url = `/api/foursquare/activity?start=${start}&end=${end}`
                const response = await fetch(url)
                const result = await response.json()

                if (loadingMonth) {
                    setLoadingMonth(false)
                    setMonth(page)
                }

                if (result.data && result.data.length >= 0) {
                    const ins = checkins.slice()
                    ins.push(result.data)
                    setCheckins(ins)
                    setEmpty(0)
                }

                if (result.data && result.data.length === 0 && empty < 2) {
                    setEmpty(empty + 1)
                    setPage(page + 1)
                } else if (page === 0 && new Date().getDate() < 15) {
                    setPage(page + 1)
                }
                debouncing.current = false
            } catch (error) {
                setError(true)
            }
        }
        fetchCheckins()

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

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

    const handleMonthChange = value => {
        if (value > page) {
            setPage(value)
            setLoadingMonth(true)
        } else {
            setMonth(value)
        }
    }

    return (
        <>
            <div className={styles.checkins} ref={pageEl}>
                <h3>Recent Check-ins</h3>
                {error && <p className={styles.error}>Unable to fetch recent check-ins.</p>}
                {!error && (
                    <ul>
                        {checkins.length
                            ? checkins.map(page =>
                                  page.map(checkin => <Checkin key={`${page}-${checkin.id}`} checkin={checkin} />)
                              )
                            : null}
                    </ul>
                )}
            </div>
            {checkins.length ? (
                <Monthly
                    checkins={loadingMonth ? null : checkins[month]}
                    month={month}
                    onMonthChange={handleMonthChange}
                />
            ) : null}
        </>
    )
}

export default Checkins
