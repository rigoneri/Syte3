import React from 'react'
import { parseISO, formatDistanceToNow } from 'date-fns'
import Modal from 'components/Modal'
import styles from 'components/Modal/Modal.module.css'

type Props = {
    item: YouTubeActivity
    onClose(): void
}

const YouTubeModal = ({ item, onClose }: Props) => {
    return (
        <Modal onClose={onClose} wide>
            <iframe
                className={styles.media}
                src={`https://www.youtube.com/embed/${item.videoId || item.id}`}
                frameBorder="0"
                allowFullScreen
                title={item.title}
                role="presentation"
            />
            <div className={`${styles.details} ${styles.stacked}`}>
                <h4>{item.title}</h4>
                <span className={styles.date}>
                    {formatDistanceToNow(typeof item.date === 'string' ? parseISO(item.date) : item.date)} ago
                </span>
                {item.description && <p dangerouslySetInnerHTML={{ __html: item.description }}></p>}
            </div>
        </Modal>
    )
}

export default YouTubeModal
