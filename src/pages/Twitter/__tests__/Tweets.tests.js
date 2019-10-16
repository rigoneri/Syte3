import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { mockTweet } from './Tweet.tests'
import Tweets from '../Tweets'

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
