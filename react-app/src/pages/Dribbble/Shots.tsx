import React, { useState, useEffect, useRef } from 'react'
import Img from 'react-image'
import { Logo } from 'components/Icons'
import Modal from './Modal'
import styles from './Dribbble.module.css'

interface ShotsResponse {
    data: DribbbleActivity[]
    nextPage: number
}

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent>

const Shots = () => {
    const [shots, setShots] = useState<DribbbleActivity[]>([])
    const [page, setPage] = useState(0)
    const nextPage = useRef(0)
    const [error, setError] = useState(false)
    const [postDetails, setPostDetails] = useState<DribbbleActivity | null>(null)
    const pageEl = useRef<HTMLDivElement>(null!)
    let debouncing = useRef(false)

    useEffect(() => {
        const fetchShots = async () => {
            try {
                let url = `/api/dribbble/activity`
                if (page) {
                    url += `?page=${page}`
                }

                const response = await fetch(url)
                const result: ShotsResponse = await response.json()
                if (result.data && result.data.length > 0) {
                    setShots(shots.concat(result.data))
                    if (result.nextPage) {
                        nextPage.current = result.nextPage
                    }
                }
                debouncing.current = false
            } catch (error) {
                setError(true)
            }
        }

        if (page === nextPage.current) {
            fetchShots()
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleScroll = () => {
        if (debouncing.current) {
            return
        }

        debouncing.current = true
        window.requestAnimationFrame(() => {
            if (window.scrollY + window.innerHeight > pageEl.current.clientHeight - 200) {
                setPage(nextPage.current)
                return
            }
            debouncing.current = false
        })
    }

    const handleClick = (e: ClickEvent, shot: DribbbleActivity) => {
        e.preventDefault()
        setPostDetails(shot)
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
            {postDetails && <Modal item={postDetails} onClose={() => setPostDetails(null)} />}
        </div>
    )
}

export default Shots
