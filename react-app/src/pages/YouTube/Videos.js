import React, { useState, useEffect, useRef } from 'react'
import Video from './Video'
import styles from './YouTube.module.css'

export default function Videos() {
    const [uploads, setUploads] = useState([])
    const [liked, setLiked] = useState([])
    const [page, setPage] = useState(0)
    const [error, setError] = useState(false)
    const [empty, setEmpty] = useState(false)

    const pageEl = useRef(null)
    let debouncing = useRef(false)

    useEffect(() => {
        fetchVideos()

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [page])

    const fetchVideos = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/youtube/${page}`)
            const pageVideos = await response.json()
            if (pageVideos) {
                const pageUploads = pageVideos.uploads
                const pageLikes = pageVideos.likes
                if (pageUploads && pageUploads.length) {
                    setUploads(uploads.concat(pageUploads))
                }
                if (pageLikes && pageLikes.length) {
                    setLiked(liked.concat(pageLikes))
                }

                if (!pageUploads && !pageLikes) {
                    setEmpty(true)
                }
            }
            debouncing.current = false
        } catch (error) {
            setError(true)
        }
    }

    const handleScroll = () => {
        if (debouncing.current || empty) {
            return
        }

        debouncing.current = true
        window.requestAnimationFrame(() => {
            if (window.scrollY + window.innerHeight > pageEl.current.clientHeight - 200) {
                setPage(page + 1)
                return
            }
            debouncing.current = false
        })
    }

    if (error) {
        return (
            <div className={styles.videos}>
                <h3>Videos</h3>
                <p className={styles.error}>Unable to fetch videos.</p>
            </div>
        )
    }

    return (
        <>
            <div className={`${styles.uploads} ${styles.videos}`} ref={pageEl}>
                <h3>Uploads</h3>
                {uploads.length ? (
                    <ul>
                        {uploads.map(video => (
                            <Video key={video.id} video={video} />
                        ))}
                    </ul>
                ) : null}
            </div>
            <div className={`${styles.likes} ${styles.videos}`}>
                <h3>Liked Videos</h3>
                {liked.length ? (
                    <ul>
                        {liked.map(video => (
                            <Video key={video.id} video={video} />
                        ))}
                    </ul>
                ) : null}
            </div>
        </>
    )
}
