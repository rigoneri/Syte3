import React, { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import Logout from './Logout'
import styles from './Admin.module.css'

export const camel2title = camelCase =>
    camelCase.replace(/([A-Z])/g, match => ` ${match}`).replace(/^./, match => match.toUpperCase())

const Admin = () => {
    const { service = 'twitter' } = useParams()
    const query = new URLSearchParams(useLocation().search)
    const [settings, setSettings] = useState()
    const [error, setError] = useState(query.get('result') === 'fail' ? true : false)
    const [success, setSuccess] = useState(query.get('result') === 'success' ? true : false)
    const [newSetting, setNewSetting] = useState('')

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`/api/configs/${service}`)
                const result = await response.json()
                if (response.ok && Object.keys(result).length) {
                    setSettings(result)
                } else {
                    setError(true)
                }
            } catch (error) {
                setError(true)
            }
        }

        fetchSettings()
    }, [service])

    const handleFieldChange = e => {
        const {
            target: { name, value },
        } = e
        setSettings(items => {
            const updated = { ...items }
            updated[name] = value
            return updated
        })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setSuccess(false)
        setError(false)

        try {
            const response = await fetch(`/api/configs/${service}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            })
            if (response.ok) {
                setSuccess(true)
            } else {
                setError(true)
            }
        } catch (error) {
            setError(true)
        }
    }

    const addNewSetting = () => {
        if (!newSetting) {
            return
        }
        setSettings(items => {
            const updated = { ...items }
            updated[newSetting] = ''
            return updated
        })
        setNewSetting('')
        setError(false)
    }

    const startAuth = async () => {
        try {
            const response = await fetch(`/api/auth/${service}`)
            const result = await response.json()
            if (response.ok && result.url) {
                window.location.href = result.url
            }
        } catch (error) {
            setError(error)
        }
    }

    return (
        <div className={styles.admin}>
            <h2>{service} Settings</h2>
            <div className={`${styles.input} ${styles.newField}`}>
                <input
                    type="text"
                    placeholder="New Setting (Camel Cased)"
                    value={newSetting}
                    onChange={e => setNewSetting(e.target.value)}
                />
                <button className={styles.primary} onClick={addNewSetting}>
                    Add
                </button>
            </div>
            {!settings && !error && <p className={styles.loading}>Loading...</p>}
            {error && query.get('result') ? (
                <p className={styles.error}>Unable to save {service} settings.</p>
            ) : (
                error && <p className={styles.error}>Unable to load {service} settings.</p>
            )}
            {success && <p className={styles.success}>Updated {service} settings successfully.</p>}
            {!error && settings && (
                <form onSubmit={handleSubmit}>
                    {Object.keys(settings)
                        .sort()
                        .map(key => {
                            const value = settings[key]
                            return (
                                <div className={styles.input} key={key}>
                                    <label>{camel2title(key)}</label>
                                    <input type="text" name={key} value={value} onChange={handleFieldChange} />
                                </div>
                            )
                        })}
                    <div className={styles.buttons}>
                        <button type="submit" className={styles.primary}>
                            Save Settings
                        </button>
                        <button type="button" className={styles.secondary} onClick={startAuth}>
                            Authenticate
                        </button>
                    </div>
                    <div className={styles.extra}>
                        <Logout />
                    </div>
                </form>
            )}
        </div>
    )
}

export default Admin
