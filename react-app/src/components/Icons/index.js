import React from 'react'

import { ReactComponent as TwitterLogo } from './TwitterLogo.svg'
import { ReactComponent as TwitterIcon } from './TwitterIcon.svg'
import { ReactComponent as DribbbleLogo } from './DribbbleLogo.svg'
import { ReactComponent as DribbbleIcon } from './DribbbleIcon.svg'
import { ReactComponent as InstagramLogo } from './InstagramLogo.svg'
import { ReactComponent as InstagramIcon } from './InstagramIcon.svg'
import { ReactComponent as GithubLogo } from './GithubLogo.svg'
import { ReactComponent as GithubIcon } from './GithubIcon.svg'
import { ReactComponent as SpotifyLogo } from './SpotifyLogo.svg'
import { ReactComponent as SpotifyIcon } from './SpotifyIcon.svg'
import { ReactComponent as YouTubeLogo } from './YouTubeLogo.svg'
import { ReactComponent as YouTubeIcon } from './YouTubeIcon.svg'
import { ReactComponent as FoursquareLogo } from './FoursquareLogo.svg'
import { ReactComponent as FoursquareIcon } from './FoursquareIcon.svg'
import { ReactComponent as TumblrLogo } from './TumblrLogo.svg'
import { ReactComponent as TumblrIcon } from './TumblrIcon.svg'
import { ReactComponent as FacebookLogo } from './FacebookLogo.svg'
import { ReactComponent as FacebookIcon } from './FacebookIcon.svg'
import { ReactComponent as FlickrLogo } from './FlickrLogo.svg'
import { ReactComponent as FlickrIcon } from './FlickrIcon.svg'
import { ReactComponent as LinkedInLogo } from './LinkedInLogo.svg'
import { ReactComponent as LinkedInIcon } from './LinkedInIcon.svg'
import { ReactComponent as PlayLogo } from './PlayLogo.svg'
import { ReactComponent as PauseLogo } from './PauseLogo.svg'
import { ReactComponent as StarIcon } from './StarIcon.svg'
import { ReactComponent as HeartIcon } from './HeartIcon.svg'
import { ReactComponent as CommentIcon } from './CommentIcon.svg'
import { ReactComponent as LoopIcon } from './LoopIcon.svg'
import { ReactComponent as GitBranchIcon } from './GitBranchIcon.svg'
import { ReactComponent as GitClosedIcon } from './GitClosedIcon.svg'
import { ReactComponent as GitCommentIcon } from './GitCommentIcon.svg'
import { ReactComponent as GitCommitIcon } from './GitCommitIcon.svg'
import { ReactComponent as GitMergeIcon } from './GitMergeIcon.svg'
import { ReactComponent as GitOpenedIcon } from './GitOpenedIcon.svg'
import { ReactComponent as GitReopenedIcon } from './GitReopenedIcon.svg'
import { ReactComponent as GitRepoIcon } from './GitRepoIcon.svg'
import { ReactComponent as GitTagIcon } from './GitTagIcon.svg'
import { ReactComponent as GitPRIcon } from './GitPRIcon.svg'
import { ReactComponent as LeftIcon } from './LeftIcon.svg'
import { ReactComponent as RightIcon } from './RightIcon.svg'

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

const Icon = ({ type }) => {
    switch (type) {
        case 'twitter':
            return <TwitterIcon />
        case 'dribbble':
            return <DribbbleIcon />
        case 'instagram':
            return <InstagramIcon />
        case 'github':
            return <GithubIcon />
        case 'spotify':
        case 'lastfm':
            return <SpotifyIcon />
        case 'youtube':
        case 'youtube-like':
            return <YouTubeIcon />
        case 'foursquare':
            return <FoursquareIcon />
        case 'tumblr':
            return <TumblrIcon />
        case 'facebook':
            return <FacebookIcon />
        case 'flickr':
            return <FlickrIcon />
        case 'linkedin':
            return <LinkedInIcon />
        default:
            return null
    }
}

const GitIcons = ({ type }) => {
    switch (type) {
        case 'git-branch':
            return <GitBranchIcon />
        case 'git-stars':
            return <StarIcon />
        case 'git-commit':
            return <GitCommitIcon />
        case 'git-merge':
            return <GitMergeIcon />
        case 'git-pull':
            return <GitPRIcon />
        case 'git-repo':
            return <GitRepoIcon />
        case 'git-issue-closed':
            return <GitClosedIcon />
        case 'git-issue':
            return <GitOpenedIcon />
        case 'git-issue-reopened':
            return <GitReopenedIcon />
        case 'git-tag':
            return <GitTagIcon />
        case 'git-comment':
            return <GitCommentIcon />
        default:
            break
    }
}

export { Logo, Icon, PlayLogo, PauseLogo, GitIcons, HeartIcon, CommentIcon, LoopIcon, LeftIcon, RightIcon }
