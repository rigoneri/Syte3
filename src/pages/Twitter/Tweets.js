import React, { useState, useEffect, useRef } from 'react'
import Tweet from './Tweet'
import styles from './Twitter.module.css'

export default function Tweets() {
    const [tweets, setTweets] = useState([])
    const [page, setPage] = useState(0)
    const [error, setError] = useState(false)
    const [empty, setEmpty] = useState(0)
    const pageEl = useRef(null)
    let debouncing = false

    useEffect(() => {
        fetchTweets()

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [page])

    const fetchTweets = async () => {
        try {
            console.log('Empty', empty)
            const response = await fetch(`http://localhost:4000/twitter/${page}`)
            const pageTweets = await response.json()
            console.log('Size', pageTweets.length)
            if (pageTweets.length > 0) {
                setTweets(tweets.concat(pageTweets))
                setEmpty(0)
            } else if (empty <= 2) {
                setPage(page + 1)
                setEmpty(empty + 1)
                //TODO: change api to not return empty pages...
            }
            debouncing = false
        } catch (error) {
            setError(true)
        }
    }

    const handleScroll = () => {
        if (debouncing) {
            return
        }

        debouncing = true
        window.requestAnimationFrame(() => {
            if (window.scrollY + window.innerHeight > pageEl.current.clientHeight - 200) {
                setPage(page + 1)
                return
            }
            debouncing = false
        })
    }

    return (
        <div className={styles.tweets} ref={pageEl}>
            <h2>Recent Tweets</h2>
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
