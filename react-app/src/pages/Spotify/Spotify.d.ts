interface SpotifyUser {
    id: string
    name: string
    username: string
    url: string | null
    picture: string | null
}

interface SpotifyActivity {
    id: string
    title: string
    url: string
    day?: string
    date?: string
    artist?: string
    image?: string
    preview_url?: string
}

interface SpotifyTimelineActivity {
    id: string
    date: string
    type: 'spotify'
    plays: number
    tracks: SpotifyActivity[]
}

interface SpotifyTracks {
    id: string
    name: string
    count: number
    url: string
    artist?: string
    image?: string
    preview_url?: string
}

interface SpotifyArtists {
    id: string
    name: string
    count: number
    url: string
    genres: string[]
    image?: string
}
