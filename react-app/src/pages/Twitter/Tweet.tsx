import React, { useState } from 'react'
import { parseISO, formatDistanceToNow } from 'date-fns'
import Img from 'react-image'
import { PlayLogo } from 'components/Icons'
import Modal from './Modal'
import styles from './Twitter.module.css'

type Props = { tweet: TwitterActivity }
type ClickEvent = React.MouseEvent<HTMLElement, MouseEvent>

const Tweet = ({ tweet }: Props) => {
    const [showDetails, setShowDetails] = useState(false)
    const handleClick = (e: ClickEvent) => {
        e.preventDefault()
        setShowDetails(!showDetails)
    }

    return (
        <li>
            <a href={tweet.url} className={styles.avatar}>
                <Img src={tweet.user.picture} alt="Avatar" />
            </a>
            <div className={styles.content}>
                <h4>
                    <a href={tweet.url}>
                        {tweet.user.name} <span className={styles.username}>@{tweet.user.username}</span>
                    </a>
                    <span className={styles.date}>{formatDistanceToNow(parseISO(tweet.date))} ago</span>
                </h4>
                <p dangerouslySetInnerHTML={{ __html: tweet.originalText ? tweet.originalText : tweet.text }}></p>
                {tweet.pictures && (
                    <ul className={styles.pictures}>
                        {tweet.pictures.map(picture => (
                            <li key={picture.id} onClick={handleClick}>
                                <span style={{ backgroundImage: `url(${picture.url})` }} className={styles.picture} />
                                {tweet.video && <PlayLogo role="figure" className={styles.video} />}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {showDetails && <Modal item={tweet} onClose={() => setShowDetails(false)} />}
        </li>
    )
}

export default Tweet
