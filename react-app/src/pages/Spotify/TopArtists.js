import React from 'react'
import Img from 'react-image'
import { Logo } from 'components/Icons'
import styles from './Spotify.module.css'

export default function TopArtists({ artists }) {
    return (
        <div className={styles.topArtists}>
            <h3>Top Artists</h3>
            {artists && artists.length ? (
                <ul>
                    {artists.map(artist => (
                        <li key={artist.id}>
                            <a href={artist.url}>
                                <Img
                                    src={artist.image}
                                    alt={artist.name}
                                    loader={
                                        <div className={styles.placeholder}>
                                            <Logo type="Spotify" />
                                        </div>
                                    }
                                />
                            </a>
                            <div className={styles.info}>
                                <div className={styles.name}>{artist.name}</div>
                                {artist.genres && artist.genres.length ? (
                                    <div className={styles.genre}>{artist.genres.length === 1 ? artist.genres[0] : artist.genres[1]}</div>
                                ) : null}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    )
}
