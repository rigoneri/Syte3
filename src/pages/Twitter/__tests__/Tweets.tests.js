import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import Tweets from '../Tweets'

const mockTweet = {
    id: 'tweet-1',
    date: '2019-10-14T02:25:32.000Z',
    type: 'twitter',
    text: 'RT <a href="https://twitter.com/rigoneri" target="_blank">@rigoneri</a>: Testing something...',
    video: 'https://video.twimg.com/test-video',
    pictures: [
        {
            id: 'pic-1',
            url: 'https://pbs.twimg.com/test-pic.jpg',
            width: 360,
            height: 360,
        },
    ],
    url: 'https://www.twitter.com/rigoneri/status/test-123',
    favorites: 0,
    retweets: 2,
    user: {
        username: 'rigoneri',
        name: 'Rigo Neri',
        picture: 'https://pbs.twimg.com/test-profile-pic.jpg',
        id: 'user-1',
    },
    originalText: 'Testing something...',
}

describe('Tweets', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('should fetch and display a list of tweets', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve([mockTweet]),
            })
        )

        let component = null
        await act(async () => {
            component = mount(<Tweets />)
        })
        expect(global.fetch).toHaveBeenCalled()
        component.update()
        expect(component.find('h2').exists()).toEqual(true)
        expect(component.find('Tweet').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should display a an error message if it fails to fetch tweets', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject())

        let component = null
        await act(async () => {
            component = mount(<Tweets />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('h2').exists()).toEqual(true)
        expect(component.find('Tweet').exists()).toEqual(false)
        expect(component.find('.error').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should load more tweets when scrolling to the end of the page', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve([{ ...mockTweet, id: `${new Date().getTime()}` }]),
            })
        )

        let component = null
        await act(async () => {
            component = mount(<Tweets />)
        })
        expect(global.fetch).toHaveBeenCalledTimes(1)
        component.update()

        expect(component.find('Tweet').exists()).toEqual(true)

        await act(async () => {
            const customEvent = new Event('scroll')
            window.dispatchEvent(customEvent)
        })
        expect(global.fetch).toHaveBeenCalledTimes(2)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should attempt to fetch more pages if empty results', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve([]),
            })
        )

        let component = null
        await act(async () => {
            component = mount(<Tweets />)
        })
        expect(global.fetch).toHaveBeenCalledTimes(3)

        component.unmount()
        global.fetch.mockRestore()
    })
})
