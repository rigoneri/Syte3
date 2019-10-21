import { useState, useEffect } from 'react'

export default function useUser(type) {
    const [user, setUser] = useState(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const url = `http://localhost:4000/${type}/user`
                const response = await fetch(url)
                const user = await response.json()
                setUser(user)
            } catch (error) {
                setError(true)
            }
        }
        fetchUser()
    }, [type])

    return [user, error]
}
