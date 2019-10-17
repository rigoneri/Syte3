import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../../components/Icons'
import styles from './Nav.module.css'

export const Nav = ({ handleOpened, opened }) => {
    const handleClick = () => {
        if (opened) {
            handleOpened()
        }
    }

    return (
        <Fragment>
            <nav>
                <ul className={styles.nav}>
                    <NavItem to="Twitter" handleClick={handleClick} />
                    <NavItem to="Github" handleClick={handleClick} />
                    <NavItem to="Dribbble" handleClick={handleClick} />
                    <NavItem to="Spotify" handleClick={handleClick} />
                    <NavItem to="Instagram" handleClick={handleClick} />
                    <NavItem to="YouTube" handleClick={handleClick} />
                    <NavItem to="Foursquare" handleClick={handleClick} />
                </ul>
                <a href="https://github.com/rigoneri/Syte2" className={styles.about}>
                    About this site
                </a>
            </nav>
            <NavButton handleClick={handleOpened} opened={opened} />
        </Fragment>
    )
}

export const NavItem = ({ to, handleClick }) => {
    return (
        <li key={to}>
            <Link to={`/${to.toLowerCase()}`} onClick={handleClick}>
                <Logo type={to} />
                <span className={styles.link}>{to}</span>
            </Link>
        </li>
    )
}

const NavButton = ({ handleClick, opened }) => {
    return (
        <button className={`${styles.navButton} ${opened ? styles.opened : ''}`} onClick={handleClick}>
            <span className={styles.bar1}></span>
            <span className={styles.bar2}></span>
            <span className={styles.bar3}></span>
        </button>
    )
}

export default Nav
