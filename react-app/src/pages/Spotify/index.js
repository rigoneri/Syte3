import React from 'react'
import Img from 'react-image'
import Error from 'components/Error'
import useUser from 'hooks/User'
import RecentTracks from './RecentTracks'
import { PlayProvider } from './PlayContext'
import Top from './Top'
import styles from './Spotify.module.css'

const Spotify = () => {
    const [user, error] = useUser('spotify')

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
            <PlayProvider>
                <RecentTracks />
                <Top />
            </PlayProvider>
        </div>
    )
}

export default Spotify
