import React from 'react'
import Img from 'react-image'
import { parseISO, formatDistanceToNow } from 'date-fns'
import Modal from 'components/Modal'
import styles from 'components/Modal/Modal.module.css'

export default function DribbbleModal({ item, onClose }) {
    return (
        <Modal onClose={onClose}>
            <Img src={item.pictureHD ? item.pictureHD : item.picture} alt="Dribbble Shot" className={styles.media} />
            <div className={styles.details}>
                <span className={`${styles.date} ${styles.noAvatar}`}>
                    {formatDistanceToNow(typeof item.date === 'string' ? parseISO(item.date) : item.date)} ago
                </span>
                <p dangerouslySetInnerHTML={{ __html: item.text }}></p>
            </div>
        </Modal>
    )
}
