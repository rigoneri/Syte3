import React, { Fragment } from 'react'
import styles from './Twitter.module.css'

export default function Photos({ username, photos }) {
    if (!photos || photos.length === 0) {
        return null
    }
    return (
        <Fragment>
            <h3>Recent Photos</h3>
            <ul className={styles.photos}>
                {photos.map(photo => (
                    <li key={photo.id}>
                        <a href={`https://twitter.com/${username}/status/${photo.tweetID}`}>
                            <span style={{ backgroundImage: `url(${photo.url})` }} />
                        </a>
                    </li>
                ))}
            </ul>
        </Fragment>
    )
}
