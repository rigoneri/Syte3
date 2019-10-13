import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../Nav'
import pic from '../../images/pic.jpg'
import styles from './Header.module.css'

export default function Header() {
    const [opened, setOpened] = useState(false)

    return (
        <header className={`${styles.Header} ${opened ? styles.opened : ''}`}>
            <hgroup>
                <Link to="/">
                    <span className={styles.picture}>
                        <img src={pic} width="50" heigh="50" alt="Profile" />
                    </span>
                    <h1>Rodrigo Neri</h1>
                </Link>
            </hgroup>
            <Nav
                handleOpened={() => {
                    setOpened(!opened)
                }}
                opened={opened}
            />
        </header>
    )
}
