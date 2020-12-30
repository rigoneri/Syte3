import React, { useContext } from 'react'
import Img from 'react-image'
import { PlayContext } from './PlayContext'
import { PlayLogo, PauseLogo } from 'components/Icons'
import styles from './Spotify.module.css'

type Props = { item: SpotifyTimelineActivity }

export const TimelineItem = ({ item }: Props) => {
    const context = useContext(PlayContext)
    return (
        <>
            {item.tracks.length ? (
                <p>
                    Listened to <a href={item.tracks[0].url}>{item.tracks[0].title}</a> by{' '}
                    <a href={item.tracks[0].url}>{item.tracks[0].artist}</a>{' '}
                    {item.plays > 2 ? (
                        <>
                            and <strong>{item.plays - 1}</strong> other tracks on Spotify.
                        </>
                    ) : (
                        <>on Spotify.</>
                    )}
                </p>
            ) : (
                <p>
                    Listened to <strong>{item.plays}</strong> {item.plays === 1 ? 'track' : 'tracks'} on Spotify.
                </p>
            )}
            {item.tracks.length ? (
                <ul className={styles.timelineTracks}>
                    {item.tracks.map(track => (
                        <li key={track.title}>
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
                        </li>
                    ))}
                </ul>
            ) : null}
        </>
    )
}
