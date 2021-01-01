import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { mockTweet } from './Tweet.tests'
import Tweets from '../Tweets'

describe('Tweets', () => {
    const modalMount = global.document.createElement('div')
    modalMount.setAttribute('id', 'modal-mount')

    beforeEach(() => {
        document.body.appendChild(modalMount)
        fetchMock.resetMocks()
    })
    afterEach(() => {
        document.body.removeChild(modalMount)
    })

    it('should fetch and display a list of tweets', async () => {
        fetchMock.once(
            JSON.stringify({
                data: [mockTweet],
                nextPage: null,
            })
        )

        render(<Tweets />)
        expect(fetchMock).toHaveBeenCalled()
        await screen.findByRole('link', { name: 'Avatar' })
        screen.getByText(`@${mockTweet.user.username}`)
        screen.getByText(/Testing something.../)
    })

    it('should display an error message if it fails to fetch tweets', async () => {
        fetchMock.mockReject(new Error('Failed Mock'))

        render(<Tweets />)
        expect(fetchMock).toHaveBeenCalled()
        await screen.findByText(/Unable to fetch recent tweets/)
        expect(screen.queryByRole('link', { name: 'Avatar' })).not.toBeInTheDocument()
    })

    it('should load more tweets when scrolling to the end of the page', async () => {
        fetchMock.mockResponses(
            [
                JSON.stringify({
                    data: [{ ...mockTweet, url: 'https://twitter.com/rigoneri/status/first', id: 'first' }],
                    nextPage: 1,
                }),
                { status: 200 },
            ],
            [
                JSON.stringify({
                    data: [{ ...mockTweet, url: 'https://twitter.com/rigoneri/status/second', id: 'second' }],
                    nextPage: null,
                }),
                { status: 200 },
            ]
        )

        render(<Tweets />)
        expect(fetchMock).toHaveBeenCalledTimes(1)
        await screen.findByRole('link', { name: 'Avatar' })
        expect(screen.getByRole('link', { name: 'Avatar' })).toHaveAttribute(
            'href',
            'https://twitter.com/rigoneri/status/first'
        )

        await act(async () => {
            const customEvent = new Event('scroll')
            window.dispatchEvent(customEvent)
        })
        expect(fetchMock).toHaveBeenCalledTimes(2)
        await screen.findAllByRole('link', { name: 'Avatar' })

        const posts = screen.getAllByRole('link', { name: 'Avatar' })
        expect(posts[0]).toHaveAttribute('href', 'https://twitter.com/rigoneri/status/first')
        expect(posts[1]).toHaveAttribute('href', 'https://twitter.com/rigoneri/status/second')
    })
})
