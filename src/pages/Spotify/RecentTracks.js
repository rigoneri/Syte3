import React, { useState, useEffect } from 'react'
import { parseISO, formatDistanceToNow } from 'date-fns'
import Img from 'react-image'
import { PlayLogo, PauseLogo } from 'components/Icons'
import styles from './Spotify.module.css'

export default function RecentTracks({ playing, onPlayTrack }) {
    const [tracks, setTracks] = useState([])
    const [error, setError] = useState(false)

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

    const handleClick = (e, track) => {
        e.preventDefault()
        onPlayTrack(track)
    }

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
                                    handleClick(e, track)
                                }}>
                                <Img src={track.image} alt={track.title} />
                                {track.preview_url && (
                                    <span className={`${styles.playIcon} ${playing && playing === track.id ? styles.playing : ''}`}>
                                        {playing && playing === track.id ? <PauseLogo /> : <PlayLogo />}
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
