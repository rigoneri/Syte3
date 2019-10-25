import React, { useState, useEffect, useRef, Fragment } from 'react'
import { parseISO, format, subDays } from 'date-fns'
import Error from 'components/Error'
import TimelineItem from './TimelineItem'
import styles from './Home.module.css'

export default function Home() {
    const [timeline, setTimeline] = useState({})
    const [page, setPage] = useState(0)
    const [error, setError] = useState(false)
    const [empty, setEmpty] = useState(0)
    const pageEl = useRef(null)
    let debouncing = useRef(false)

    useEffect(() => {
        fetchTimeline()

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [page])

    const fetchTimeline = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/stream/${page}`)
            const pagePosts = await response.json()
            if (pagePosts.length > 0) {
                groupTimeline(pagePosts)
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
        <div className={styles.timeline} ref={pageEl}>
            <span className={styles.line} />
            {Object.values(timeline).map(group => (
                <Fragment key={group.title}>
                    <h2>{group.title}</h2>
                    <ul>
                        {group.items.map(item => (
                            <TimelineItem key={item._id} item={item} />
                        ))}
                    </ul>
                </Fragment>
            ))}
        </div>
    )
}
