import React, { useContext } from 'react'
import Img from 'react-image'
import { PlayContext } from './PlayContext'
import { PlayLogo, PauseLogo } from 'components/Icons'
import styles from './Spotify.module.css'

const TopTracks = ({ tracks }) => {
    const context = useContext(PlayContext)
    return (
        <div className={styles.topTracks}>
            <h3>Top Tracks</h3>
            {tracks && tracks.length ? (
                <ul>
                    {tracks.map(track => (
                        <li key={track.id}>
                            <a href={track.url} className={styles.album}>
                                <Img src={track.image} alt={track.title} />
                            </a>
                            {track.preview_url && (
                                <span
                                    className={`${styles.playIcon} ${
                                        context.playing && context.playing === track.id ? styles.playing : ''
                                    }`}
                                    onClick={() => {
                                        context.onPlayTrack(track)
                                    }}>
                                    {context.playing && context.playing === track.id ? <PauseLogo /> : <PlayLogo />}
                                </span>
                            )}
                            <a href={track.url} className={styles.name}>
                                {track.name}
                            </a>
                            <span className={styles.artist}>{track.artist}</span>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    )
}

export default TopTracks
