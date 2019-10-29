import React from 'react'
import Img from 'react-image'
import styles from './Spotify.module.css'

export const TimelineItem = ({ item }) => {
    return (
        <>
            {item.tracks.length ? (
                <p>
                    Listened to <a href={item.tracks[0].url}>{item.tracks[0].title}</a> by <a href={item.tracks[0].url}>{item.tracks[0].artist}</a>{' '}
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
                            <a href={track.url}>
                                <Img src={track.image} alt={track.title} />
                            </a>
                        </li>
                    ))}
                </ul>
            ) : null}
        </>
    )
}
