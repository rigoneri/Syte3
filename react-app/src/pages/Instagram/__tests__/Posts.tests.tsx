import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { mockPost } from './Post.tests'
import Posts from '../Posts'

describe('Posts', () => {
    const modalMount = global.document.createElement('div')
    modalMount.setAttribute('id', 'modal-mount')

    beforeEach(() => {
        document.body.appendChild(modalMount)
        fetchMock.resetMocks()
    })
    afterEach(() => {
        document.body.removeChild(modalMount)
    })

    it('should fetch and display a list of instagram posts', async () => {
        fetchMock.once(
            JSON.stringify({
                data: [mockPost],
                nextPage: null,
            })
        )

        render(<Posts />)
        expect(fetchMock).toHaveBeenCalled()
        await screen.findByRole('link', { name: 'Instagram Post' })
    })

    it('should display an error message if it fails to fetch instagram posts', async () => {
        fetchMock.mockReject(new Error('Failed Mock'))

        render(<Posts />)
        expect(fetchMock).toHaveBeenCalled()
        await screen.findByText(/Unable to fetch Instagram posts/)
        expect(screen.queryByRole('link', { name: 'Instagram Post' })).not.toBeInTheDocument()
    })

    it('should load more posts when scrolling to the end of the page', async () => {
        fetchMock.mockResponses(
            [
                JSON.stringify({
                    data: [{ ...mockPost, picture: 'https://rigoneri.com/first.jpg', id: 'first' }],
                    nextPage: 1,
                }),
                { status: 200 },
            ],
            [
                JSON.stringify({
                    data: [{ ...mockPost, picture: 'https://rigoneri.com/second.jpg', id: 'second' }],
                    nextPage: null,
                }),
                { status: 200 },
            ]
        )

        render(<Posts />)
        expect(fetchMock).toHaveBeenCalledTimes(1)
        await screen.findByAltText('Instagram Post')
        expect(screen.getByAltText('Instagram Post')).toHaveAttribute('src', 'https://rigoneri.com/first.jpg')

        await act(async () => {
            const customEvent = new Event('scroll')
            window.dispatchEvent(customEvent)
        })
        expect(fetchMock).toHaveBeenCalledTimes(2)
        await screen.findAllByAltText('Instagram Post')

        const posts = screen.getAllByAltText('Instagram Post')
        expect(posts[0]).toHaveAttribute('src', 'https://rigoneri.com/first.jpg')
        expect(posts[1]).toHaveAttribute('src', 'https://rigoneri.com/second.jpg')
    })
})
