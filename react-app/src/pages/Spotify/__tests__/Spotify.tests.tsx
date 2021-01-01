import React from 'react'
import { render, screen } from '@testing-library/react'
import Spotify from '../index'

export const mockUser: SpotifyUser = {
    id: '1231606952',
    name: 'Syte User',
    username: 'syte',
    url: 'https://open.spotify.com/user/1231606952',
    picture: 'https://scontent.xx.fbcdn.net/762233502138656859_n.jpg',
}

describe('Spotify', () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    it('should fetch the spotify user', async () => {
        fetchMock.mockResponse(request => {
            if (request.url === '/api/spotify/user') {
                return Promise.resolve(JSON.stringify(mockUser))
            }

            return Promise.reject(new Error('Failed Mock'))
        })

        render(<Spotify />)
        expect(fetchMock).toHaveBeenCalled()

        //User
        await screen.findByRole('heading', { name: mockUser.name })

        //Recent Tracks
        await screen.findByRole('heading', { name: 'Recent Tracks' })

        //Top
        await screen.findByRole('heading', { name: 'Top Artists' })
    })

    it('should display an error message if it fails to get the spotify user', async () => {
        fetchMock.mockReject(new Error('Failed Mock'))

        render(<Spotify />)
        expect(fetchMock).toHaveBeenCalled()
        await screen.findByText(/Unable to fetch spotify profile/)
    })
})
