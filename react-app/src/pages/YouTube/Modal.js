import React from 'react'
import { parseISO, formatDistanceToNow } from 'date-fns'
import Modal from 'components/Modal'
import styles from 'components/Modal/Modal.module.css'

export default function YouTubeModal({ item, onClose }) {
    return (
        <Modal onClose={onClose} wide>
            <iframe className={styles.media} src={`https://www.youtube.com/embed/${item.id}`} frameBorder="0" allowFullScreen title={item.title} />
            <div className={`${styles.details} ${styles.stacked}`}>
                <h4>{item.title}</h4>
                <span className={styles.date}>{formatDistanceToNow(typeof item.date === 'string' ? parseISO(item.date) : item.date)} ago</span>
                <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
            </div>
        </Modal>
    )
}
