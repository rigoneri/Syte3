import { useState, useEffect } from 'react'

export default function useUser<T>(type: string): [T | null, boolean] {
    const [user, setUser] = useState<T | null>(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const url = `/api/${type}/user`
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
