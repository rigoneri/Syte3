import React, { useState, useEffect } from 'react'
import Post from './Post'
import styles from './Instagram.module.css'

export default function Posts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const response = await fetch(`http://localhost:4000/instagram/recent`)
            const posts = await response.json()
            if (posts.length > 0) {
                setPosts(posts)
            }
            setLoading(false)
        } catch (error) {
            setError(true)
        }
    }

    return (
        <div className={styles.posts}>
            {error && <p className={styles.error}>Unable to fetch Instagram posts.</p>}
            {!loading && !posts.length && !error && <p className={styles.empty}>No recent activity.</p>}
            {!loading && !error && posts.length ? (
                <ul>
                    {posts.map(post => (
                        <Post key={post.id} post={post} />
                    ))}
                </ul>
            ) : null}
        </div>
    )
}
