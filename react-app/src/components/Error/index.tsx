import React from 'react'
import styles from './Error.module.css'

type Props = { message: string | null }

const Error = ({ message }: Props) => {
    return (
        <div className={styles.Error}>
            <h3>
                <span role="img" aria-label="Sad face">
                    &#128557;
                </span>
            </h3>
            <p>{message || 'Unable to load'}</p>
        </div>
    )
}

export default Error
