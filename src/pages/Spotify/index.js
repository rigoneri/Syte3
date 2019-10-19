import React, { useState, useEffect, useRef } from 'react'
import Img from 'react-image'
import Error from 'components/Error'
import RecentTracks from './RecentTracks'
import { PlayContext } from './PlayContext'
import Top from './Top'
import styles from './Spotify.module.css'

export default function Spotify() {
    const [user, setUser] = useState(null)
    const [error, setError] = useState(false)
    const [playing, setPlaying] = useState(null)
    let audio = useRef(new Audio())

    const fetchUser = async () => {
        try {
            const response = await fetch('http://localhost:4000/spotify/user')
            const user = await response.json()
            setUser(user)
        } catch (error) {
            setError(true)
        }
    }

    useEffect(() => {
        fetchUser()
        let currentAudio = audio.current
        currentAudio.onended = () => {
            setPlaying(null)
        }

        return () => {
            if (currentAudio && !currentAudio.paused) {
                currentAudio.pause()
            }
        }
    }, [])

    const playTrack = track => {
        const playTrack = playing !== track.id ? track.id : null
        setPlaying(playTrack)
        if (!audio.current.paused) {
            audio.current.pause()
        }
        if (playTrack) {
            audio.current.setAttribute('src', track.preview_url)
            audio.current.play()
        }
    }

    if (error) {
        return <Error message="Unable to fetch spotify profile." />
    }

    return (
        <div className={styles.page}>
            {user && (
                <div className={styles.profile}>
                    <a href={user.url} className={styles.picture}>
                        <Img src={user.picture} alt="Spotify Profile" />
                    </a>
                    <h2>{user.name}</h2>
                </div>
            )}
            <PlayContext.Provider
                value={{
                    playing: playing,
                    onPlayTrack: playTrack,
                }}>
                <RecentTracks />
                <Top />
            </PlayContext.Provider>
        </div>
    )
}
