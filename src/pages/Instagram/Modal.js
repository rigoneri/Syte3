import React from 'react'
import Img from 'react-image'
import { parseISO, formatDistanceToNow } from 'date-fns'
import { PlayLogo, HeartIcon, CommentIcon } from 'components/Icons'
import Modal from 'components/Modal'
import styles from 'components/Modal/Modal.module.css'

export default function InstagramModal({ item, onClose }) {
    return (
        <Modal onClose={onClose}>
            {item.video ? (
                <video src={item.video.url} className={styles.media} poster={item.pictureHD} controls />
            ) : (
                <Img src={item.pictureHD ? item.pictureHD : item.picture} alt="Instagram Post" className={styles.media} />
            )}
            <div className={styles.details}>
                <h4>{item.user.username}</h4>
                <a href={item.url} className={styles.avatar}>
                    <Img src={item.user.profile_picture} alt="Avatar" />
                </a>
                <span className={styles.date}>{formatDistanceToNow(parseISO(item.date))} ago</span>
                <ul className={styles.stats}>
                    <li>
                        <HeartIcon />
                        <span>{item.likes}</span>
                    </li>
                    <li>
                        <CommentIcon />
                        <span>{item.comments}</span>
                    </li>
                </ul>
                <p dangerouslySetInnerHTML={{ __html: item.text }}></p>
            </div>
        </Modal>
    )
}
