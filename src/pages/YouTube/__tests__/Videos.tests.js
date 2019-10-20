import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { mockVideo } from './Video.tests'
import Videos from '../Videos'

describe('Videos', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    afterAll(() => {
        jest.resetAllMocks()
    })

    it('should fetch and display a list of videos', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve({
                        likes: [mockVideo],
                        uploads: [mockVideo],
                    }),
            })
        )

        let component = null
        await act(async () => {
            component = mount(<Videos />)
        })
        expect(global.fetch).toHaveBeenCalled()
        component.update()
        expect(component.find('h3').exists()).toEqual(true)
        expect(component.find('.uploads').exists()).toEqual(true)
        expect(component.find('.likes').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should display an error message if it fails to fetch videos', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject())

        let component = null
        await act(async () => {
            component = mount(<Videos />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('h3').exists()).toEqual(true)
        expect(component.find('.uploads').exists()).toEqual(false)
        expect(component.find('.likes').exists()).toEqual(false)
        expect(component.find('.error').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should load more videos when scrolling to the end of the page', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve({
                        likes: [{ ...mockVideo, id: `${new Date().getTime()}` }],
                        uploads: [{ ...mockVideo, id: `${new Date().getTime()}-2` }],
                    }),
            })
        )

        let component = null
        await act(async () => {
            component = mount(<Videos />)
        })
        expect(global.fetch).toHaveBeenCalledTimes(1)
        component.update()

        expect(component.find('.uploads').exists()).toEqual(true)
        expect(component.find('.likes').exists()).toEqual(true)

        await act(async () => {
            const customEvent = new Event('scroll')
            window.dispatchEvent(customEvent)
        })
        expect(global.fetch).toHaveBeenCalledTimes(2)

        component.unmount()
        global.fetch.mockRestore()
    })
})
