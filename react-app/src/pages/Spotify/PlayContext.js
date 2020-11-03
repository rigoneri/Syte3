import React, { useState, useEffect, useRef } from 'react'

export const PlayContext = React.createContext()

export const PlayProvider = ({ children }) => {
    const [playing, setPlaying] = useState(null)
    let audio = useRef(new Audio())

    useEffect(() => {
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

    return (
        <PlayContext.Provider
            value={{
                playing: playing,
                onPlayTrack: playTrack,
            }}>
            {children}
        </PlayContext.Provider>
    )
}
