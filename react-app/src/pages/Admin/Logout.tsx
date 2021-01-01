import React from 'react'
import { useHistory } from 'react-router-dom'

interface LogoutResponse {
    success: boolean
}
type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent>

const Logout = () => {
    const history = useHistory()

    const handleLogout = async (e: ClickEvent) => {
        e.preventDefault()

        try {
            const response = await fetch('/api/logout')
            if (response.ok) {
                const result: LogoutResponse = await response.json()
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
