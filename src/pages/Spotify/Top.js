import React, { useState, useEffect } from 'react'
import TopArtists from './TopArtists'
import TopTracks from './TopTracks'
import styles from './Spotify.module.css'

export default function Top() {
    const [top, setTop] = useState(null)
    const [error, setError] = useState(false)

    const fetchTop = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/spotify/top`)
            const top = await response.json()
            setTop(top)
        } catch (error) {
            setError(true)
        }
    }

    useEffect(() => {
        fetchTop()
    }, [])

    return (
        <div className={styles.top}>
            {error && (
                <>
                    <h3>Top Artists</h3>
                    <p className={styles.error}>Unable to fetch top artists and tracks.</p>
                </>
            )}
            {top ? (
                <>
                    <TopArtists artists={top ? top.artists : null} />
                    <TopTracks tracks={top ? top.tracks : null} />
                </>
            ) : null}
        </div>
    )
}
