import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styles from './Admin.module.css'

interface LoginResponse {
    success: boolean
}
type ChangeEvent = React.ChangeEvent<HTMLInputElement>
type SubmitEvent = React.FormEvent<HTMLFormElement>

const Login = () => {
    const history = useHistory()
    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const handleChange = (e: ChangeEvent) => {
        setValue(e.target.value)
    }

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault()
        if (!value.length) {
            return
        }

        try {
            setLoading(true)
            setError(false)
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: value,
                }),
            })
            setLoading(false)
            if (response.ok) {
                const result: LoginResponse = await response.json()
                if (result.success) {
                    history.push('/admin/twitter')
                }
            } else {
                setError(true)
                setValue('')
            }
        } catch (error) {
            console.error(error)
            setLoading(false)
            setError(true)
        }
    }

    return (
        <div className={styles.admin}>
            <h2>Admin Login</h2>
            {error && <p className={styles.error}>Login failed.</p>}
            {loading && <p className={styles.loading}>Loading...</p>}
            {!loading && (
                <form onSubmit={handleSubmit}>
                    <div className={styles.input}>
                        <label>Password</label>
                        <input type="password" name="password" value={value} onChange={handleChange} />
                    </div>
                    <div className={styles.buttons}>
                        <button type="submit" className={styles.primary}>
                            Submit
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}

export default Login
