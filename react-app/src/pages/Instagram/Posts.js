import React, { useState, useEffect, useRef } from 'react'
import Post from './Post'
import styles from './Instagram.module.css'

const Posts = () => {
    const [posts, setPosts] = useState([])
    const [page, setPage] = useState(null)
    const nextPage = useRef(null)
    const [error, setError] = useState(false)
    const pageEl = useRef(null)
    let debouncing = useRef(false)

    useEffect(() => {
        const fetchPosts = async () => {
            nextPage.current = null
            try {
                let url = `/api/instagram/activity`
                if (page) {
                    url += `?page=${page}&limit=15`
                } else {
                    url += '?limit=15'
                }

                const response = await fetch(url)
                const result = await response.json()
                if (result.data && result.data.length > 0) {
                    setPosts(posts.concat(result.data))
                    if (result.nextPage) {
                        nextPage.current = result.nextPage
                    } else {
                        nextPage.current = 'end'
                    }
                }
                debouncing.current = false
            } catch (error) {
                setError(true)
            }
        }

        if (page === nextPage.current && page !== 'end') {
            fetchPosts()
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

    return (
        <div className={styles.posts} ref={pageEl}>
            {error && <p className={styles.error}>Unable to fetch Instagram posts.</p>}
            {!error && posts.length ? (
                <ul>
                    {posts.map(post => (
                        <Post key={post.id} post={post} />
                    ))}
                </ul>
            ) : null}
        </div>
    )
}

export default Posts
