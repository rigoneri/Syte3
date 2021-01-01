import React, { useState, useEffect, useRef } from 'react'

interface PlayContextInterface {
    playing: string | null
    onPlayTrack: (track: SpotifyActivity | SpotifyTracks) => void
}

export const PlayContext = React.createContext<PlayContextInterface | undefined>(undefined)

interface PlayProviderInterface {
    children: React.ReactNode
}

export const PlayProvider = ({ children }: PlayProviderInterface) => {
    const [playing, setPlaying] = useState<string | null>(null)
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

    const playTrack = (track: SpotifyActivity | SpotifyTracks) => {
        const playTrack = playing !== track.id ? track.id : null
        setPlaying(playTrack)
        if (!audio.current.paused) {
            audio.current.pause()
        }
        if (playTrack && track.preview_url) {
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
