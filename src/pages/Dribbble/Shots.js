import React, { useState, useEffect, useRef } from 'react'
import Img from 'react-image'
import { Logo } from 'components/Icons'
import styles from './Dribbble.module.css'

export default function Shots() {
    const [shots, setShots] = useState([])
    const [page, setPage] = useState(0)
    const [error, setError] = useState(false)
    const [empty, setEmpty] = useState(0)
    const pageEl = useRef(null)
    let debouncing = false

    useEffect(() => {
        fetchShots()

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [page])

    const fetchShots = async () => {
        try {
            const response = await fetch(`http://localhost:4000/dribbble/${page}`)
            const pageShots = await response.json()
            if (pageShots.length > 0) {
                setShots(shots.concat(pageShots))
                setEmpty(0)
            } else if (empty < 2) {
                setEmpty(empty + 1)
                setPage(page + 1)
                //TODO: change api to not return empty pages...
            }
            debouncing = false
        } catch (error) {
            setError(true)
        }
    }

    const handleScroll = () => {
        if (debouncing) {
            return
        }

        debouncing = true
        window.requestAnimationFrame(() => {
            if (window.scrollY + window.innerHeight > pageEl.current.clientHeight - 200) {
                setPage(page + 1)
                return
            }
            debouncing = false
        })
    }

    const handleClick = (e, shot) => {
        e.preventDefault()
        console.log('TODO OPEN MODAL', shot)
    }

    return (
        <div className={styles.shots} ref={pageEl}>
            {error && <p className={styles.error}>Unable to fetch Dribbble shots.</p>}
            {!error && shots.length ? (
                <ul>
                    {shots.map(shot => (
                        <li key={shot.id}>
                            <a href={shot.url} className={styles.shot} onClick={e => handleClick(e, shot)}>
                                <Img
                                    src={shot.picture}
                                    alt={shot.title}
                                    loader={
                                        <div className={styles.placeholder}>
                                            <Logo type="Dribbble" />
                                        </div>
                                    }
                                />
                            </a>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    )
}
