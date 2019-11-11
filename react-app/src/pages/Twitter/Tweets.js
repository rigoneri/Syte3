import React, { useState, useEffect, useRef } from 'react'
import Tweet from './Tweet'
import styles from './Twitter.module.css'

export default function Tweets() {
    const [tweets, setTweets] = useState([])
    const [page, setPage] = useState(0)
    const [error, setError] = useState(false)
    const [empty, setEmpty] = useState(0)
    const pageEl = useRef(null)
    let debouncing = useRef(false)

    useEffect(() => {
        fetchTweets()

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [page])

    const fetchTweets = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/twitter/${page}`)
            const pageTweets = await response.json()
            if (pageTweets.length > 0) {
                setTweets(tweets.concat(pageTweets))
                setEmpty(0)

                if (page === 0 && new Date().getDate() < 15) {
                    setPage(page + 1)
                }
            } else if (empty < 2) {
                setEmpty(empty + 1)
                setPage(page + 1)
                //TODO: change api to not return empty pages...
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
