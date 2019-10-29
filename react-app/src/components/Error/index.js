import React from 'react'
import styles from './Error.module.css'

const Error = ({ message }) => {
    return (
        <div className={styles.Error}>
            <h3>:(</h3>
            <p>{message || 'Unable to load'}</p>
        </div>
    )
}

export default Error
