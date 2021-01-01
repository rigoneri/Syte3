interface DribbbleUser {
    id: number
    name: string
    username?: string
    url: string
    picture: string
    followers: number
    following: number
    shots: number
    bio?: string
}

interface DribbbleActivity {
    id: number
    date: string
    type: 'dribbble'
    title: string
    text: string
    url: string
    picture: string
    pictureHD?: string
}
