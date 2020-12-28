import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import Twitter from '../index'

export const mockUser = {
    id: 'tweet-id-1',
    type: 'user',
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
    afterAll(() => {
        jest.resetAllMocks()
    })

    it('should fetch the twitter user', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(url => {
            if (url.includes('/user')) {
                return Promise.resolve({
                    json: () => Promise.resolve(mockUser),
                })
            }
            return Promise.reject()
        })

        let component = null
        await act(async () => {
            component = mount(<Twitter />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('Profile').exists()).toEqual(true)
        expect(component.find('Tweets').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should display an error message if it fails to get the twitter user', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject())

        let component = null
        await act(async () => {
            component = mount(<Twitter />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('Error').exists()).toEqual(true)
        expect(component.find('Profile').exists()).toEqual(false)
        expect(component.find('Tweets').exists()).toEqual(false)

        component.unmount()
        global.fetch.mockRestore()
    })
})
