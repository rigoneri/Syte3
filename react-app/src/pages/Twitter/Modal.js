import React, { useState, useEffect } from 'react'
import Img from 'react-image'
import { parseISO, formatDistanceToNow } from 'date-fns'
import { HeartIcon, LoopIcon, LeftIcon, RightIcon } from 'components/Icons'
import Modal from 'components/Modal'
import styles from 'components/Modal/Modal.module.css'

const TwitterModal = ({ item, onClose }) => {
    const [pictureIndex, setPictureIndex] = useState(0)
    const [picture, setPicture] = useState(null)

    useEffect(() => {
        if (!item.pictures.length) {
            return
        }

        if (pictureIndex > item.pictures.length - 1) {
            setPictureIndex(0)
        } else if (pictureIndex < 0) {
            setPictureIndex(item.pictures.length - 1)
        } else {
            setPicture(item.pictures[pictureIndex])
        }
    }, [pictureIndex, item.pictures])

    return (
        <Modal onClose={onClose}>
            <div className={styles.media}>
                {item.video ? (
                    <video src={item.video} controls />
                ) : picture ? (
                    <Img src={picture.url} alt="Twitter Picture" />
                ) : null}
                {item.pictures.length > 1 ? (
                    <>
                        <span
                            className={styles.leftIcon}
                            onClick={() => {
                                setPictureIndex(pictureIndex + 1)
                            }}>
                            <LeftIcon />
                        </span>
                        <span
                            className={styles.rightIcon}
                            onClick={() => {
                                setPictureIndex(pictureIndex - 1)
                            }}>
                            <RightIcon />
                        </span>
                    </>
                ) : null}
            </div>
            <div className={styles.details}>
                <h4>@{item.user.username}</h4>
                <a href={item.url} className={styles.avatar}>
                    <Img src={item.user.picture} alt="Avatar" />
                </a>
                <span className={styles.date}>
                    {formatDistanceToNow(typeof item.date === 'string' ? parseISO(item.date) : item.date)} ago
                </span>
                <ul className={styles.stats}>
                    <li>
                        <HeartIcon />
                        <span>{item.favorites ? item.favorites.toLocaleString() : '0'}</span>
                    </li>
                    <li>
                        <LoopIcon />
                        <span>{item.retweets ? item.retweets.toLocaleString() : '0'}</span>
                    </li>
                </ul>
                <p dangerouslySetInnerHTML={{ __html: item.originalText ? item.originalText : item.text }}></p>
            </div>
        </Modal>
    )
}

export default TwitterModal
