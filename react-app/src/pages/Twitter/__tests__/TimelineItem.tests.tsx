import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockTweet } from './Tweet.tests'
import { TimelineItem } from '../TimelineItem'

describe('TimelineItem', () => {
    const modalMount = global.document.createElement('div')
    modalMount.setAttribute('id', 'modal-mount')

    beforeEach(() => {
        document.body.appendChild(modalMount)
    })
    afterEach(() => {
        document.body.removeChild(modalMount)
    })

    it('should display a tweet', () => {
        render(<TimelineItem item={mockTweet} />)
        expect(screen.getByRole('link', { name: 'Avatar' })).toHaveAttribute('href', mockTweet.url)
        expect(screen.getByAltText('Avatar')).toHaveAttribute('src', mockTweet.user.picture)
        screen.getByText(`@${mockTweet.user.username}`)
        screen.getByText(/Testing something.../)
        expect(screen.getByRole('list')).toHaveAttribute('class', 'pictures')
    })

    it('should display pictures', () => {
        let tweet = { ...mockTweet }
        delete tweet.video

        render(<TimelineItem item={tweet} />)
        expect(screen.getByRole('list')).toHaveAttribute('class', 'pictures')
        expect(screen.queryByRole('figure')).not.toBeInTheDocument()
    })

    it('should display videos', () => {
        render(<TimelineItem item={mockTweet} />)
        expect(screen.getByRole('list')).toHaveAttribute('class', 'pictures')
        expect(screen.getByRole('figure')).toHaveAttribute('class', 'video')
    })

    it('should not display pictures or videos if not in tweet', () => {
        let tweet = { ...mockTweet }
        delete tweet.video
        delete tweet.pictures

        render(<TimelineItem item={tweet} />)
        expect(screen.queryByRole('list')).not.toBeInTheDocument()
        expect(screen.queryByRole('figure')).not.toBeInTheDocument()
    })

    it('should show a modal when clicking the twitter picture', () => {
        let tweet = { ...mockTweet }
        delete tweet.video

        render(<TimelineItem item={tweet} />)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

        const item = screen.getByRole('listitem')
        userEvent.click(item)
        screen.getByRole('dialog')
    })
})
