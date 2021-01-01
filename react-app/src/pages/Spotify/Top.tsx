import React, { useState, useEffect } from 'react'
import TopArtists from './TopArtists'
import TopTracks from './TopTracks'
import styles from './Spotify.module.css'

interface TopResponse {
    artists: SpotifyArtists[]
    tracks: SpotifyTracks[]
}

const Top = () => {
    const [top, setTop] = useState<TopResponse | null>(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchTop = async () => {
            try {
                const response = await fetch(`/api/spotify/top`)
                const top: TopResponse = await response.json()
                setTop(top)
            } catch (error) {
                setError(true)
            }
        }
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

export default Top
