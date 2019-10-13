import React from 'react'

import { ReactComponent as TwitterLogo } from './TwitterLogo.svg'
import { ReactComponent as DribbbleLogo } from './DribbbleLogo.svg'
import { ReactComponent as InstagramLogo } from './InstagramLogo.svg'
import { ReactComponent as GithubLogo } from './GithubLogo.svg'
import { ReactComponent as SpotifyLogo } from './SpotifyLogo.svg'
import { ReactComponent as YouTubeLogo } from './YouTubeLogo.svg'
import { ReactComponent as FoursquareLogo } from './FoursquareLogo.svg'
import { ReactComponent as TumblrLogo } from './TumblrLogo.svg'
import { ReactComponent as FacebookLogo } from './FacebookLogo.svg'
import { ReactComponent as FlickrLogo } from './FlickrLogo.svg'
import { ReactComponent as LinkedInLogo } from './LinkedInLogo.svg'
import { ReactComponent as PlayLogo } from './PlayLogo.svg'

const Logo = ({ type }) => {
    switch (type) {
        case 'Twitter':
            return <TwitterLogo />
        case 'Dribbble':
            return <DribbbleLogo />
        case 'Instagram':
            return <InstagramLogo />
        case 'Github':
            return <GithubLogo />
        case 'Spotify':
            return <SpotifyLogo />
        case 'YouTube':
            return <YouTubeLogo />
        case 'Foursquare':
            return <FoursquareLogo />
        case 'Tumblr':
            return <TumblrLogo />
        case 'Facebook':
            return <FacebookLogo />
        case 'Flickr':
            return <FlickrLogo />
        case 'LinkedIn':
            return <LinkedInLogo />
        default:
            return null
    }
}

export { Logo, PlayLogo }
