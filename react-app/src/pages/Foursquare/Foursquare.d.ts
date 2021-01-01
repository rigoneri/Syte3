interface FoursquareUser {
    id: string
    name: string
    url: string
    checkins?: number
    friends?: number
    bio?: string
    location: string
    picture?: string
}

interface FoursquareActivity {
    id: string
    date: string
    type: 'foursquare'
    title: string
    event: string | null
    lat?: number
    lng?: number
    city?: string
    state?: string
    country?: string
    category?: string
    icon?: string
    url?: string
}
