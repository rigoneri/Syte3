import React, { useState } from 'react'
import Img from 'react-image'
import { Logo, PlayLogo, HeartIcon, CommentIcon } from 'components/Icons'
import Modal from './Modal'
import styles from './Instagram.module.css'

export default function Post({ post }) {
    const [videoVisible, setVideoVisible] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const handleClick = e => {
        e.preventDefault()
        setShowDetails(!showDetails)
    }

    return (
        <li>
            <a href={post.url} className={styles.post} onClick={handleClick}>
                <Img
                    src={post.pictureHD}
                    alt="Instagram Post"
                    loader={
                        <div className={styles.placeholder}>
                            <Logo type="Instagram" />
                        </div>
                    }
                    onLoad={() => {
                        setVideoVisible(true)
                    }}
                />
                {post.video && <span className={styles.video}>{videoVisible && <PlayLogo />}</span>}
                <ul className={styles.stats}>
                    <li>
                        <HeartIcon />
                        <span>{post.likes}</span>
                    </li>
                    <li>
                        <CommentIcon />
                        <span>{post.comments}</span>
                    </li>
                </ul>
            </a>
            {showDetails && <Modal item={post} onClose={handleClick} />}
        </li>
    )
}
