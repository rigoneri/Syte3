import React from 'react'
import { render, screen } from '@testing-library/react'
import { mockTweet } from './Tweet.tests'
import Twitter from '../index'

export const mockUser: TwitterUser = {
    id: 'tweet-id-1',
    name: 'Syte User',
    username: 'syteuser',
    description: 'Some description',
    url: 'https://t.co/test1',
    followers: 100,
    following: 100,
    statuses: 100,
    location: null,
    picture: 'https://pbs.twimg.com/profile_images/test-1.png',
    banner: 'https://pbs.twimg.com/profile_banners/test-1',
    pictures: [
        {
            id: 'photo-1',
            url: 'https://pbs.twimg.com/media/image-1.png',
            width: 600,
            height: 600,
            tweetID: 'tweet-id-1',
            date: '2018-04-18T03:20:09.000Z',
        },
    ],
}

describe('Twitter', () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    it('should fetch the twitter user', async () => {
        fetchMock.mockResponse(request => {
            if (request.url === '/api/twitter/user') {
                return Promise.resolve(JSON.stringify(mockUser))
            } else if (request.url.startsWith('/api/twitter/activity')) {
                return Promise.resolve(
                    JSON.stringify({
                        data: [mockTweet],
                        nextPage: null,
                    })
                )
            }

            return Promise.reject(new Error('Failed Mock'))
        })

        render(<Twitter />)
        expect(fetchMock).toHaveBeenCalledTimes(2)

        //User
        await screen.findByRole('heading', { name: mockUser.name })

        //Tweets
        await screen.findByText(/Testing something.../)
    })

    it('should display an error message if it fails to get the twitter user', async () => {
        fetchMock.mockRejectOnce(new Error('Failed Mock'))

        render(<Twitter />)
        expect(fetchMock).toHaveBeenCalled()

        await screen.findByText('Unable to fetch twitter profile.')
    })
})
