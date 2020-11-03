import React from 'react'
import { useHistory } from 'react-router-dom'

const Logout = () => {
    const history = useHistory()

    const handleLogout = async e => {
        e.preventDefault()

        try {
            const response = await fetch('/api/logout')
            if (response.ok) {
                const result = await response.json()
                if (result.success) {
                    history.push('/')
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <a href="/api/logout" onClick={handleLogout}>
            Logout
        </a>
    )
}

export default Logout
