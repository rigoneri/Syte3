import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../../components/Icons'
import styles from './Nav.module.css'

const Nav = ({ handleOpened }) => {
    return (
        <Fragment>
            <nav>
                <ul className={styles.nav}>
                    <NavItem to="Twitter" />
                    <NavItem to="Github" />
                    <NavItem to="Dribbble" />
                    <NavItem to="Spotify" />
                    <NavItem to="Instagram" />
                    <NavItem to="YouTube" />
                    <NavItem to="Foursquare" />
                </ul>
                <a href="https://github.com/rigoneri/Syte2" className={styles.about}>
                    About this site
                </a>
            </nav>
            <NavButton handleOpened={handleOpened} />
        </Fragment>
    )
}

const NavItem = ({ to }) => {
    return (
        <li key={to}>
            <Link to={`/${to.toLowerCase()}`}>
                <Logo type={to} />
                <span className={styles.link}>{to}</span>
            </Link>
        </li>
    )
}

const NavButton = ({ handleOpened }) => {
    let [opened, setOpened] = useState(false)

    const handleOnClick = () => {
        setOpened(!opened)
        handleOpened(!opened)
    }

    return (
        <span className={`${styles.navButton} ${opened ? styles.opened : ''}`} onClick={handleOnClick}>
            <span className={styles.bar1}></span>
            <span className={styles.bar2}></span>
            <span className={styles.bar3}></span>
        </span>
    )
}

export default Nav
