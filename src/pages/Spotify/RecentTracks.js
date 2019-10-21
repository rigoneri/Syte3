import React, { useState, useEffect, useContext } from 'react'
import { parseISO, formatDistanceToNow } from 'date-fns'
import Img from 'react-image'
import { PlayContext } from './PlayContext'
import { PlayLogo, PauseLogo } from 'components/Icons'
import styles from './Spotify.module.css'

export default function RecentTracks() {
    const [tracks, setTracks] = useState([])
    const [error, setError] = useState(false)
    const context = useContext(PlayContext)

    const fetchTracks = async () => {
        try {
            const response = await fetch('http://localhost:4000/spotify/activity')
            const tracks = await response.json()
            setTracks(tracks)
        } catch (error) {
            setError(true)
        }
    }

    useEffect(() => {
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
                                    context.onPlayTrack(track)
                                }}>
                                <Img src={track.image} alt={track.title} />
                                {track.preview_url && (
                                    <span className={`${styles.playIcon} ${context.playing && context.playing === track.id ? styles.playing : ''}`}>
                                        {context.playing && context.playing === track.id ? <PauseLogo /> : <PlayLogo />}
                                    </span>
                                )}
                            </a>
                            <a href={track.url} className={styles.title}>
                                {track.title}
                            </a>
                            <span className={styles.artist}>{track.artist}</span>
                            <span className={styles.date}>{formatDistanceToNow(parseISO(track.date))} ago</span>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    )
}
