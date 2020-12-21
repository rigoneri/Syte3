import React from 'react'
import { render, screen } from '@testing-library/react'
import Github from '../index'

export const mockUser = {
    id: '1234',
    name: 'Syte3 User',
    username: 'syte3',
    followers: 189,
    following: 16,
    repos: [
        {
            id: 12345,
            name: 'Repo',
            url: 'https://github.com/some/repo',
            updated: '2019-09-30T14:08:47Z',
            description: 'Some repo',
            language: 'JavaScript',
            forks: 56,
            favorites: 187,
        },
    ],
    picture: 'https://avatars2.githubusercontent.com/u/0?v=4',
    url: 'https://github.com/syte3',
    description: 'Some description...',
}

describe('Github', () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    it('should fetch the github user', async () => {
        fetchMock.mockResponse(request => {
            if (request.url === '/api/github/user') {
                return Promise.resolve(JSON.stringify(mockUser))
            } else if (request.url === '/api/github/activity') {
                return Promise.resolve(
                    JSON.stringify({
                        data: [],
                        nextPage: null,
                    })
                )
            }

            return Promise.reject(new Error('Failed Mock'))
        })

        render(<Github />)
        expect(fetchMock).toHaveBeenCalledTimes(2)

        //User
        await screen.findByRole('heading', { name: mockUser.name })

        //Repos
        screen.getByRole('heading', { name: 'Repositories' })

        //Activities
        expect(screen.queryByText(/No recent activity/)).toBeInTheDocument()
    })

    it('should display an error message if it fails to get the github user', async () => {
        fetchMock.mockReject(new Error('Failed Mock'))

        render(<Github />)
        expect(fetchMock).toHaveBeenCalledTimes(2)

        await screen.findByText('Unable to fetch github profile.')
    })
})
