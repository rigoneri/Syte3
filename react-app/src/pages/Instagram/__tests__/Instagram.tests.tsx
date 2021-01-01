import React from 'react'
import { render, screen } from '@testing-library/react'
import Instagram from '../index'
import { mockPost } from './Post.tests'

export const mockUser: InstagramUser = {
    id: '1326084',
    username: 'syte3',
    full_name: 'Syte User',
    counts: {
        media: 661,
    },
    url: 'https://instagram.com/syte3',
}

describe('Instagram', () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    it('should fetch the instagram user', async () => {
        fetchMock.mockResponse(request => {
            if (request.url === '/api/instagram/user') {
                return Promise.resolve(JSON.stringify(mockUser))
            } else if (request.url.startsWith('/api/instagram/activity')) {
                return Promise.resolve(
                    JSON.stringify({
                        data: [mockPost],
                        nextPage: null,
                    })
                )
            }

            return Promise.reject(new Error('Failed Mock'))
        })

        render(<Instagram />)
        expect(fetchMock).toHaveBeenCalledTimes(2)

        //User
        await screen.findByRole('heading', { name: mockUser.full_name })

        //Posts
        await screen.findByRole('link', { name: 'Instagram Post' })
    })

    it('should display an error message if it fails to get the instagram user', async () => {
        fetchMock.mockRejectOnce(new Error('Failed Mock'))

        render(<Instagram />)
        expect(fetchMock).toHaveBeenCalled()

        await screen.findByText('Unable to fetch instagram profile.')
    })
})
