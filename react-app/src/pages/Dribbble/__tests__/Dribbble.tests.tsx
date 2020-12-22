import React from 'react'
import { render, screen } from '@testing-library/react'
import { mockShot } from './Shots.tests'
import Dribbble from '../index'

export const mockUser = {
    id: 12345,
    name: 'Syte User',
    username: 'syte3',
    url: 'https://dribbble.com/syte3',
    picture: 'https://cdn.dribbble.com/users/1/avatars/normal/new-avatar.png',
    followers: 94,
    following: 0,
    shots: 1,
    bio: 'Some description...',
}

describe('Dribbble', () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    it('should fetch the dribbble user', async () => {
        fetchMock.mockResponse(request => {
            if (request.url === '/api/dribbble/user') {
                return Promise.resolve(JSON.stringify(mockUser))
            } else if (request.url.startsWith('/api/dribbble/activity')) {
                return Promise.resolve(
                    JSON.stringify({
                        data: [mockShot],
                        nextPage: null,
                    })
                )
            }

            return Promise.reject(new Error('Failed Mock'))
        })

        render(<Dribbble />)
        expect(fetchMock).toHaveBeenCalledTimes(2)

        //User
        await screen.findByRole('heading', { name: mockUser.name })

        //Shots
        await screen.findByAltText(mockShot.title)
    })

    it('should display an error message if it fails to get the dribbble user', async () => {
        fetchMock.mockRejectOnce(new Error('Failed Mock'))

        render(<Dribbble />)
        expect(fetchMock).toHaveBeenCalled()

        await screen.findByText('Unable to fetch dribbble profile.')
    })
})
