import React, { useState, useEffect, useContext } from 'react'
import { parseISO, formatDistanceToNow } from 'date-fns'
import Img from 'react-image'
import { PlayContext } from './PlayContext'
import { PlayLogo, PauseLogo } from 'components/Icons'
import styles from './Spotify.module.css'

interface ActivityResponse {
    data: SpotifyActivity[]
    nextPage: number
}

const RecentTracks = () => {
    const [tracks, setTracks] = useState<SpotifyActivity[]>([])
    const [error, setError] = useState(false)
    const context = useContext(PlayContext)

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const response = await fetch(`/api/spotify/activity?limit=50`)
                const result: ActivityResponse = await response.json()
                if (result.data && result.data.length > 0) {
                    setTracks(result.data)
                }
            } catch (error) {
                setError(true)
            }
        }
        fetchTracks()
    }, [])

    return (
        <div className={styles.recentTracks}>
            <h3>Recent Tracks</h3>
            {error && <p className={styles.error}>Unable to fetch recent tracks.</p>}
            {tracks && tracks.length ? (
                <ul>
                    {tracks.map(track => (
                        <li key={`${track.id}-${track.date}`}>
                            <a
                                href={track.url}
                                className={styles.album}
                                onClick={e => {
                                    e.preventDefault()
                                    if (context) {
                                        context.onPlayTrack(track)
                                    }
                                }}>
                                <Img src={track.image} alt={track.title} />
                                {track.preview_url && (
                                    <span
                                        className={`${styles.playIcon} ${
                                            context && context.playing && context.playing === track.id
                                                ? styles.playing
                                                : ''
                                        }`}>
                                        {context && context.playing && context.playing === track.id ? (
                                            <PauseLogo />
                                        ) : (
                                            <PlayLogo />
                                        )}
                                    </span>
                                )}
                            </a>
                            <a href={track.url} className={styles.title}>
                                {track.title}
                            </a>
                            <span className={styles.artist}>{track.artist}</span>
                            {track.date && (
                                <span className={styles.date}>{formatDistanceToNow(parseISO(track.date))} ago</span>
                            )}
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    )
}

export default RecentTracks
