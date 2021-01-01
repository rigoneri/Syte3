import React from 'react'
import { render, screen } from '@testing-library/react'
import Photos from '../Photos'

describe('Photos', () => {
    it('should display a list of photos', () => {
        const photos: TwitterPicture[] = [
            {
                id: 'photo-1',
                tweetID: 'tweet-id-1',
                url: 'https://pbs.twimg.com/photo-1.png',
                width: 500,
                height: 500,
                date: '2020-06-29T17:37:02.000Z',
            },
            {
                id: 'photo-2',
                tweetID: 'tweet-id-2',
                url: 'https://pbs.twimg.com/photo-2.png',
                width: 500,
                height: 500,
                date: '2019-10-31T12:51:31.000Z',
            },
        ]
        render(<Photos username="syte" photos={photos} />)

        screen.getByRole('heading', { name: 'Recent Photos' })
        const links = screen.getAllByRole('link')
        expect(links[0]).toHaveAttribute('href', `https://twitter.com/syte/status/tweet-id-1`)
        expect(links[1]).toHaveAttribute('href', `https://twitter.com/syte/status/tweet-id-2`)
    })

    it('should not display if there are no photos', () => {
        render(<Photos username="syte" photos={[]} />)
        expect(screen.queryByText('Recent Photos')).not.toBeInTheDocument()
    })
})
