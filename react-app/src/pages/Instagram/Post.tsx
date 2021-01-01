import React, { useState } from 'react'
import Img from 'react-image'
import { Logo, PlayLogo } from 'components/Icons'
import Modal from './Modal'
import styles from './Instagram.module.css'

type Props = { post: InstagramActivity }
type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent>

const Post = ({ post }: Props) => {
    const [videoVisible, setVideoVisible] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const handleClick = (e: ClickEvent) => {
        e.preventDefault()
        setShowDetails(!showDetails)
    }

    return (
        <li>
            <a href={post.url} className={styles.post} onClick={handleClick}>
                <Img
                    src={post.picture}
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
                {post.video && (
                    <span className={styles.video} role="figure">
                        {videoVisible && <PlayLogo />}
                    </span>
                )}
            </a>
            {showDetails && <Modal item={post} onClose={() => setShowDetails(false)} />}
        </li>
    )
}

export default Post
