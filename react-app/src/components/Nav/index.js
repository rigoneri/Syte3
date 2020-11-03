import React, { useEffect } from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'
import { Logo } from 'components/Icons'
import styles from './Nav.module.css'

export const Nav = ({ handleOpened, opened }) => {
    const handleClick = () => {
        if (opened) {
            handleOpened()
        }
    }

    const changeStyle = () => {
        const html = document.getElementsByTagName('html')[0]
        html.classList.toggle('light-theme')
        window.dispatchEvent(new CustomEvent('theme-changed'))

        if (window.localStorage) {
            window.localStorage.setItem('theme', html.classList.contains('light-theme') ? 'light' : 'dark')
        }
    }

    useEffect(() => {
        if (window.localStorage && window.localStorage.getItem('theme') === 'light') {
            changeStyle()
        }
    }, [])

    return (
        <>
            <nav>
                <ul className={styles.nav}>
                    <NavItem to="Twitter" handleClick={handleClick} />
                    <NavItem to="Foursquare" handleClick={handleClick} />
                    <NavItem to="Instagram" handleClick={handleClick} />
                    <NavItem to="Spotify" handleClick={handleClick} />
                    <NavItem to="Github" handleClick={handleClick} />
                    <NavItem to="Dribbble" handleClick={handleClick} />
                    <NavItem to="YouTube" handleClick={handleClick} />
                </ul>
                <div className={styles.themes}>
                    <span>Themes:</span>
                    <button onClick={changeStyle} className={styles.light}>
                        Light Theme
                    </button>
                    <button onClick={changeStyle} className={styles.dark}>
                        Dark Theme
                    </button>
                </div>
                <a href="https://github.com/rigoneri/Syte3" className={styles.about}>
                    About this site
                </a>
            </nav>
            <NavButton handleClick={handleOpened} opened={opened} />
        </>
    )
}

export const NavItem = ({ to, handleClick }) => {
    const admin = useRouteMatch('/admin')
    return (
        <li key={to}>
            <NavLink
                to={`/${admin ? 'admin/' : ''}${to.toLowerCase()}`}
                onClick={handleClick}
                activeClassName={styles.active}>
                <Logo type={to} />
                <span className={styles.link}>{to}</span>
            </NavLink>
        </li>
    )
}

const NavButton = ({ handleClick, opened }) => {
    return (
        <button className={`${styles.navButton} ${opened ? styles.opened : ''}`} onClick={handleClick}>
            <span className={styles.bar1}></span>
            <span className={styles.bar2}></span>
            <span className={styles.bar3}></span>
            Menu
        </button>
    )
}

export default Nav
