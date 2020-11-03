import React, { useState, useEffect, useRef } from 'react'
import Tweet from './Tweet'
import styles from './Twitter.module.css'

const Tweets = () => {
    const [tweets, setTweets] = useState([])
    const [page, setPage] = useState(null)
    const nextPage = useRef(null)
    const [error, setError] = useState(false)
    const pageEl = useRef(null)
    let debouncing = useRef(false)

    useEffect(() => {
        const fetchTweets = async () => {
            nextPage.current = null
            try {
                let url = `/api/twitter/activity`
                if (page) {
                    url += `?page=${page}`
                }

                const response = await fetch(url)
                const result = await response.json()
                if (result.data && result.data.length > 0) {
                    setTweets(tweets.concat(result.data))
                    if (result.nextPage) {
                        nextPage.current = result.nextPage
                    }
                }
                debouncing.current = false
            } catch (error) {
                setError(true)
            }
        }

        if (page === nextPage.current) {
            fetchTweets()
        }

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
                setPage(nextPage.current)
                return
            }
            debouncing.current = false
        })
    }

    return (
        <div className={styles.tweets} ref={pageEl}>
            <h3>Recent Tweets</h3>
            {error && <p className={styles.error}>Unable to fetch recent tweets.</p>}
            {!error && (
                <ul>
                    {tweets.map(tweet => (
                        <Tweet tweet={tweet} key={tweet.id} />
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Tweets
