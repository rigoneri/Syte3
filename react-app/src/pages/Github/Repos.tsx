import React from 'react'
import { GitIcons } from 'components/Icons'
import styles from './Github.module.css'

type Props = { repos: Repo[] }

const Repos = ({ repos }: Props) => {
    return (
        <div className={styles.repos}>
            <h3>Repositories</h3>
            {repos && repos.length ? (
                <ul>
                    {repos.map(repo => (
                        <li key={repo.id}>
                            <a href={repo.url}>{repo.name}</a>
                            <p>{repo.description}</p>
                            <ul className={styles.stats}>
                                <li>{repo.language}</li>
                                <li>
                                    <GitIcons type="git-stars" />{' '}
                                    {repo.favorites ? repo.favorites.toLocaleString() : '0'}
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

export default Repos
