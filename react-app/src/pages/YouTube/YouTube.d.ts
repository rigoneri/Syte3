interface YouTubeUser {
    id: string
    name: string
    url: string
    picture?: string
    subscribers?: string
    banner?: string
}

interface YouTubeActivity {
    id: string
    date: string
    type: 'youtube' | 'youtube-like'
    title: string
    description: string | null
    videoId?: string
    image?: string
}
