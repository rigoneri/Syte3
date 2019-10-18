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
import { ReactComponent as StarIcon } from './StarIcon.svg'
import { ReactComponent as HeartIcon } from './HeartIcon.svg'
import { ReactComponent as CommentIcon } from './CommentIcon.svg'
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

export { Logo, PlayLogo, GitIcons, HeartIcon, CommentIcon }
