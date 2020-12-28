import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Tweet from '../Tweet'

export const mockTweet: TwitterActivity = {
    id: 'tweet-1',
    date: '2019-10-14T02:25:32.000Z',
    type: 'twitter',
    text: 'RT <a href="https://twitter.com/rigoneri" target="_blank">@rigoneri</a>: Testing something...',
    video: 'https://video.twimg.com/test-video',
    pictures: [
        {
            id: 'pic-1',
            tweetID: 'tweet-1',
            url: 'https://pbs.twimg.com/test-pic.jpg',
            width: 360,
            height: 360,
            date: '2020-06-29T17:37:02.000Z',
        },
    ],
    url: 'https://www.twitter.com/rigoneri/status/test-123',
    favorites: 0,
    retweets: 2,
    user: {
        username: 'rigoneri',
        name: 'Rigo Neri',
        picture: 'https://pbs.twimg.com/test-profile-pic.jpg',
        id: 'user-1',
    },
    originalText: 'Testing something...',
    retweeted: true,
}

describe('Tweet', () => {
    const modalMount = global.document.createElement('div')
    modalMount.setAttribute('id', 'modal-mount')

    beforeEach(() => {
        document.body.appendChild(modalMount)
    })
    afterEach(() => {
        document.body.removeChild(modalMount)
    })

    it('should display a tweet', () => {
        render(<Tweet tweet={mockTweet} />)
        expect(screen.getByRole('link', { name: 'Avatar' })).toHaveAttribute('href', mockTweet.url)
        expect(screen.getByAltText('Avatar')).toHaveAttribute('src', mockTweet.user.picture)
        screen.getByText(`@${mockTweet.user.username}`)
        screen.getByText(/Testing something.../)
        expect(screen.getByRole('list')).toHaveAttribute('class', 'pictures')
    })

    it('should display a date formatted from now', () => {
        let now = new Date()
        now.setDate(now.getDate() - 1)

        render(<Tweet tweet={{ ...mockTweet, date: now.toISOString() }} />)
        screen.getByText('1 day ago')

        now.setDate(now.getDate() - 30)
        render(<Tweet tweet={{ ...mockTweet, date: now.toISOString() }} />)
        screen.getByText('about 1 month ago')
    })

    it('should display pictures', () => {
        let tweet = { ...mockTweet }
        delete tweet['video']

        render(<Tweet tweet={tweet} />)
        expect(screen.getByRole('list')).toHaveAttribute('class', 'pictures')
        expect(screen.queryByRole('figure')).not.toBeInTheDocument()
    })

    it('should display videos', () => {
        render(<Tweet tweet={mockTweet} />)
        expect(screen.getByRole('list')).toHaveAttribute('class', 'pictures')
        expect(screen.getByRole('figure')).toHaveAttribute('class', 'video')
    })

    it('should not display pictures or videos if not in tweet', () => {
        let tweet = { ...mockTweet }
        delete tweet.video
        delete tweet.pictures

        render(<Tweet tweet={tweet} />)
        expect(screen.queryByRole('list')).not.toBeInTheDocument()
        expect(screen.queryByRole('figure')).not.toBeInTheDocument()
    })

    it('should show a modal when clicking the twitter picture', () => {
        let tweet = { ...mockTweet }
        delete tweet.video

        render(<Tweet tweet={tweet} />)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

        const items = screen.getAllByRole('listitem')
        userEvent.click(items[1])
        screen.getByRole('dialog')
    })
})
