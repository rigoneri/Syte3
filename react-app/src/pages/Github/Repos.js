import React, { useState, useEffect } from 'react'
import { GitIcons } from 'components/Icons'
import styles from './Github.module.css'

export default function Repos() {
    const [repos, setRepos] = useState([])
    const [error, setError] = useState(false)

    const fetchRepos = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/github/repos`)
            const repos = await response.json()
            setRepos(repos)
        } catch (error) {
            setError(true)
        }
    }

    useEffect(() => {
        fetchRepos()
    }, [])

    return (
        <div className={styles.repos}>
            <h3>Repositories</h3>
            {error && <p className={styles.error}>Unable to fetch repositories.</p>}
            {repos && repos.length ? (
                <ul>
                    {repos.map(repo => (
                        <li key={repo.id}>
                            <a href={repo.url}>{repo.name}</a>
                            <p>{repo.description}</p>
                            <ul className={styles.stats}>
                                <li>{repo.language}</li>
                                <li>
                                    <GitIcons type="git-stars" /> {repo.favorites ? repo.favorites.toLocaleString() : '0'}
                                </li>
                                <li>
                                    <GitIcons type="git-branch" /> {repo.forks ? repo.forks.toLocaleString() : '0'}
                                </li>
                            </ul>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    )
}