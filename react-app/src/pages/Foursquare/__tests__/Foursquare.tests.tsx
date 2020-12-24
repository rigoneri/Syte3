import React from 'react'
import { render, screen } from '@testing-library/react'
import Foursquare from '../index'

export const mockUser: FoursquareUser = {
    id: '8786308',
    name: 'Syte User',
    url: 'https://foursquare.com/syteuser',
    checkins: 1951,
    friends: 54,
    location: 'Some City, ST',
    picture: 'https://fastly.4sqi.net/img/user/260x260/8786308_l39eLB6S',
}

describe('Foursquare', () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    it('should fetch the foursquare user', async () => {
        fetchMock.mockResponse(request => {
            if (request.url === '/api/foursquare/user') {
                return Promise.resolve(JSON.stringify(mockUser))
            } else if (request.url.startsWith('/api/foursquare/activity')) {
                return Promise.resolve(
                    JSON.stringify({
                        data: [],
                        nextPage: null,
                    })
                )
            }

            return Promise.reject(new Error('Failed Mock'))
        })

        render(<Foursquare />)
        expect(fetchMock).toHaveBeenCalledTimes(2)

        //User
        await screen.findByRole('heading', { name: mockUser.name })

        //Checkins
        expect(screen.getByRole('heading', { name: 'Recent Check-ins' }))
    })

    it('should display an error message if it fails to get the foursquare user', async () => {
        fetchMock.mockRejectOnce(new Error('Failed Mock'))

        render(<Foursquare />)
        expect(fetchMock).toHaveBeenCalled()

        await screen.findByText('Unable to fetch foursquare profile.')
    })
})
