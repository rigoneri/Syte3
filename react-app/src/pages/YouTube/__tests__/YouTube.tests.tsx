import React from 'react'
import { render, screen } from '@testing-library/react'
import { mockVideo } from './Video.tests'
import YouTube from '../index'

export const mockUser: YouTubeUser = {
    id: 'UCll0NBAw',
    name: 'Syte User',
    url: 'https://www.youtube.com/channel/UCll0NBA',
    picture: 'https://yt3.ggpht.com/a/AGF-l7_T-zYUQRHs',
    subscribers: '87',
    banner: 'https://yt3.ggpht.com/4FQvdzh1uozqiyqlj3HAU',
}

describe('YouTube', () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    it('should fetch the youtube user', async () => {
        fetchMock.mockResponse(request => {
            if (request.url === '/api/youtube/user') {
                return Promise.resolve(JSON.stringify(mockUser))
            } else if (request.url.startsWith('/api/youtube-uploads/activity')) {
                return Promise.resolve(
                    JSON.stringify({
                        data: [{ ...mockVideo, id: 'upload' }],
                        nextPage: null,
                    })
                )
            } else if (request.url.startsWith('/api/youtube-likes/activity')) {
                return Promise.resolve(
                    JSON.stringify({
                        data: [{ ...mockVideo, id: 'like' }],
                        nextPage: null,
                    })
                )
            }

            return Promise.reject(new Error('Failed Mock'))
        })

        render(<YouTube />)
        expect(fetchMock).toHaveBeenCalledTimes(3)

        // User
        await screen.findByRole('heading', { name: mockUser.name })

        // Uploads
        await screen.findByRole('heading', { name: 'Uploads' })
        await screen.findByRole('heading', { name: 'Liked Videos' })
    })

    it('should display an error message if it fails to get the youtube user', async () => {
        fetchMock.mockRejectOnce(new Error('Failed Mock'))

        render(<YouTube />)
        expect(fetchMock).toHaveBeenCalled()

        await screen.findByText('Unable to fetch youtube profile.')
    })
})
