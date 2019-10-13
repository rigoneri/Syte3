import React, { useState, useEffect } from 'react'
import { GitIcons } from '../../components/Icons'
import styles from './Github.module.css'

export default function Repos() {
    const [repos, setRepos] = useState([])

    useEffect(() => {
        const fetchRepos = async () => {
            const response = await fetch('http://localhost:4000/github/repos')
            const repos = await response.json()
            setRepos(repos)
        }
        fetchRepos()
    }, [])

    return (
        <div className={styles.repos}>
            <h3>Repositories</h3>
            {repos && (
                <ul>
                    {repos.map(repo => (
                        <li key={repo.id}>
                            <a href={repo.url}>{repo.name}</a>
                            <p>{repo.description}</p>
                            <ul className={styles.stats}>
                                <li>{repo.language}</li>
                                <li>
                                    <GitIcons type="git-stars" /> {repo.favorites}
                                </li>
                                <li>
                                    <GitIcons type="git-branch" /> {repo.forks}
                                </li>
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
