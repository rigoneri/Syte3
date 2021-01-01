interface InstagramUser {
    id: string
    username?: string
    full_name: string
    url: string
    counts: {
        media: number
    }
    picture?: string
}

interface InstagramActivity {
    id: string
    date: string
    type: 'instagram'
    url: string
    text: string
    picture: string
    video?: {
        url: string
        width: number
        height: number
    }
}
