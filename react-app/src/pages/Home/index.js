import React, { useState, useEffect, useRef, Fragment } from 'react'
import { parseISO, format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import Error from 'components/Error'
import TimelineItem from './TimelineItem'
import { PlayProvider } from 'pages/Spotify/PlayContext'
import styles from './Home.module.css'

const Home = () => {
    const [timeline, setTimeline] = useState({})
    const [page, setPage] = useState(0)
    const [error, setError] = useState(false)
    const [empty, setEmpty] = useState(0)
    const pageEl = useRef(null)
    let debouncing = useRef(false)

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                let date = subMonths(new Date(), page)
                let start = startOfMonth(date).getTime()
                let end = endOfMonth(date).getTime()

                const url = `/api/timeline?start=${start}&end=${end}`
                const response = await fetch(url)
                const result = await response.json()

                if (result.data && result.data.length > 0) {
                    groupTimeline(result.data)
                    setEmpty(0)

                    if (page === 0 && new Date().getDate() < 10) {
                        setPage(page + 1)
                    }
                } else if (empty < 2) {
                    setEmpty(empty + 1)
                    setPage(page + 1)
                }
                debouncing.current = false
            } catch (error) {
                setError(true)
            }
        }
        fetchTimeline()

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

    let today = format(new Date(), 'yyyy-MM-dd')
    let yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')
    let year = format(new Date(), 'yyyy')

    const groupTimeline = posts => {
        let newTimeline = { ...timeline }

        posts.forEach(post => {
            post.date = parseISO(post.date)
            post.time = format(post.date, 'h:mm a')

            const day = format(post.date, 'yyyy-MM-dd')

            if (newTimeline[day]) {
                newTimeline[day].items.push(post)
            } else {
                let title = format(post.date, 'EEEE, MMMM d')
                if (day === today) {
                    title = 'Today'
                } else if (day === yesterday) {
                    title = 'Yesterday'
                } else if (day.substring(0, 4) !== year) {
                    title = format(post.date, 'EEEE, MMMM d, yyyy')
                }

                newTimeline[day] = {
                    title,
                    items: [post],
                }
            }
        })

        setTimeline(newTimeline)
    }

    if (error) {
        return <Error message="Unable to fetch timeline." />
    }

    return (
        <PlayProvider>
            <div className={styles.timeline} ref={pageEl}>
                <span className={styles.line} />
                {Object.values(timeline).map(group => (
                    <Fragment key={group.title}>
                        <h2>{group.title}</h2>
                        <ul>
                            {group.items.map(item => (
                                <TimelineItem key={item.id} item={item} />
                            ))}
                        </ul>
                    </Fragment>
                ))}
            </div>
        </PlayProvider>
    )
}

export default Home
