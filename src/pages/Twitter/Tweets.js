import React, { useState, useEffect, useRef } from 'react'
import { parseISO, formatDistanceToNow } from 'date-fns'
import { PlayLogo } from '../../components/Icons'
import styles from './Twitter.module.css'

export default function Tweets() {
    const [tweets, setTweets] = useState([])
    const [page, setPage] = useState(0)
    const pageEl = useRef(null)
    let debouncing = false
    let empty = 0

    useEffect(() => {
        fetchTweets()

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [page])

    const fetchTweets = async () => {
        const response = await fetch(`http://localhost:4000/twitter/${page}`)
        const pageTweets = await response.json()
        if (pageTweets.length > 0) {
            setTweets(tweets.concat(pageTweets))
            empty = 0
        } else if (empty <= 2) {
            setPage(page + 1)
            empty += 1
            //TODO: change api to not return empty pages...
        }
        debouncing = false
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

    const handleClick = tweet => {
        console.log('TODO OPEN Modal', tweet)
    }

    return (
        <div className={styles.tweets} ref={pageEl}>
            <h2>Recent Tweets</h2>
            <ul>
                {tweets.map(tweet => (
                    <li key={tweet.id}>
                        <a href={tweet.url} className={styles.avatar}>
                            <img src={tweet.user.picture} alt="Avatar" />
                        </a>
                        <div className={styles.content}>
                            <h4>
                                <a href={tweet.url}>
                                    {tweet.user.name} <span className={styles.username}>@{tweet.user.username}</span>
                                </a>
                                <span className={styles.date}> {formatDistanceToNow(parseISO(tweet.date))} ago</span>
                            </h4>
                            <p dangerouslySetInnerHTML={{ __html: tweet.text }}></p>
                            {tweet.pictures && (
                                <ul className={styles.pictures}>
                                    {tweet.pictures.map(picture => (
                                        <li key={picture.id} onClick={() => handleClick(tweet)}>
                                            <span style={{ backgroundImage: `url(${picture.url})` }} className={styles.picture} />
                                            {tweet.video && <PlayLogo className={styles.video} />}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
