import React, { useState, useEffect, useRef } from 'react'
import Video from './Video'
import styles from './YouTube.module.css'

interface VideosResponse {
    data: YouTubeActivity[]
    nextPage: number
}

const Videos = () => {
    const [uploads, setUploads] = useState<YouTubeActivity[]>([])
    const [liked, setLiked] = useState<YouTubeActivity[]>([])
    const [page, setPage] = useState<number | null>(null)
    const nextUploadsPage = useRef<number | null>(null)
    const nextLikedPage = useRef<number | null>(null)
    const [error, setError] = useState(false)

    const pageEl = useRef<HTMLDivElement>(null!)
    let debouncing = useRef(false)

    useEffect(() => {
        const fetchActivity = async (service: 'youtube-uploads' | 'youtube-likes', nextPage: number | null) => {
            try {
                let url = `/api/${service}/activity`
                if (nextPage) {
                    url += `?page=${nextPage}`
                }

                const response = await fetch(url)
                const result: VideosResponse = await response.json()
                return result
            } catch (error) {
                setError(true)
            }
            return null
        }

        const fetchLiked = async () => {
            const likes: VideosResponse | null = await fetchActivity('youtube-likes', nextLikedPage.current)
            if (likes && likes.data && likes.data.length > 0) {
                setLiked(values => values.concat(likes.data))
                nextLikedPage.current = likes.nextPage
                debouncing.current = false
            }
        }

        const fetchUploads = async () => {
            const uploads = await fetchActivity('youtube-uploads', nextUploadsPage.current)
            if (uploads && uploads.data && uploads.data.length > 0) {
                setUploads(values => values.concat(uploads.data))
                nextUploadsPage.current = uploads.nextPage
                debouncing.current = false
            }
        }

        const fetchVideos = () => {
            if (nextUploadsPage.current || (!nextLikedPage.current && !nextUploadsPage.current)) {
                fetchUploads()
            }
            if (nextLikedPage.current || (!nextLikedPage.current && !nextUploadsPage.current)) {
                fetchLiked()
            }
        }

        if (page === nextLikedPage.current || page === nextUploadsPage.current) {
            fetchVideos()
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
                if (nextLikedPage.current || nextUploadsPage.current) {
                    setPage(nextLikedPage.current || nextUploadsPage.current)
                }

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

export default Videos
