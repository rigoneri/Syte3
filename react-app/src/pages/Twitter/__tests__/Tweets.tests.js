import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { mockTweet } from './Tweet.tests'
import Tweets from '../Tweets'

describe('Tweets', () => {
    const RealDate = Date
    function mockDate(isoDate) {
        global.Date = class extends RealDate {
            constructor(...theArgs) {
                if (theArgs.length) {
                    return new RealDate(...theArgs)
                }
                return new RealDate(isoDate)
            }

            static now() {
                return new RealDate(isoDate).getTime()
            }
        }
    }

    beforeEach(() => {
        jest.resetAllMocks()
    })

    afterEach(() => {
        global.Date = RealDate
    })

    afterAll(() => {
        jest.resetAllMocks()
    })

    it('should fetch and display a list of tweets', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve({
                        data: [mockTweet],
                        nextPage: null,
                    }),
            })
        )

        mockDate('2019-11-20T11:01:58.135Z')

        let component = null
        await act(async () => {
            component = mount(<Tweets />)
        })
        expect(global.fetch).toHaveBeenCalled()
        component.update()
        expect(component.find('h3').exists()).toEqual(true)
        expect(component.find('Tweet').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should display an error message if it fails to fetch tweets', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject())

        mockDate('2019-11-20T11:01:58.135Z')

        let component = null
        await act(async () => {
            component = mount(<Tweets />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('h3').exists()).toEqual(true)
        expect(component.find('Tweet').exists()).toEqual(false)
        expect(component.find('.error').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should load more tweets when scrolling to the end of the page', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve({
                        data: [{ ...mockTweet, id: `${Math.round(Math.random() * 10000)}`, pictures: null }],
                        nextPage: 123,
                    }),
            })
        )

        mockDate('2019-11-20T11:01:58.135Z')

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
})
