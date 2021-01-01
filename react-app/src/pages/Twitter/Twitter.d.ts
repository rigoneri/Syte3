interface TwitterUser {
    id: string
    name: string
    username: string
    description: string | null
    location: string | null
    url: string
    followers: number
    following: number
    statuses: number
    picture: string
    banner: string | null
    pictures?: TwitterPicture[]
}

interface TwitterPicture {
    id: string
    url: string
    tweetID: string
    date: string
    width?: number
    height?: number
}

interface TwitterActivity {
    id: string
    date: string
    timestamp?: string
    type: 'twitter'
    url: string
    text: string
    originalText?: string
    pictures?: TwitterPicture[]
    video?: string
    favorites: number
    retweets: number
    retweeted: boolean
    user: TweetUser
}

interface TweetUser {
    id: string
    name: string
    username: string
    picture: string
}
