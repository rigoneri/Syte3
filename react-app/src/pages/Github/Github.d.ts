interface GithubUser {
    name: string
    username?: string
    description?: string
    picture: string
    url: string
    repos: Repo[]
    followers: number
    following: number
}

interface Repo {
    id: number
    name: string
    url: string
    updated: string
    description?: string
    language: string
    fork?: boolean
    forks: number
    favorites: number
}

interface GitActivity {
    id: string
    date: string
    icon: GitIcon
    description: string
    comment?: string
}
