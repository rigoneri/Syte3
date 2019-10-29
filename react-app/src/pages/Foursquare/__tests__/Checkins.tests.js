import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { mockCheckin } from './Checkin.tests'
import Checkins from '../Checkins'

describe('Check-ins', () => {
    jest.mock('../Monthly', () => {
        return {
            __esModule: true,
            default: () => {
                return <div />
            },
        }
    })

    beforeEach(() => {
        jest.resetAllMocks()
    })

    afterAll(() => {
        jest.resetAllMocks()
    })

    it('should fetch and display a list of check-ins', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve([mockCheckin]),
            })
        )

        let component = null
        await act(async () => {
            component = mount(<Checkins />)
        })
        expect(global.fetch).toHaveBeenCalled()
        component.update()
        expect(component.find('h3').exists()).toEqual(true)
        expect(component.find('Checkin').exists()).toEqual(true)
        expect(component.find('Monthly').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should display an error message if it fails to fetch check-ins', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject())

        let component = null
        await act(async () => {
            component = mount(<Checkins />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('h3').exists()).toEqual(true)
        expect(component.find('Checkin').exists()).toEqual(false)
        expect(component.find('Monthly').exists()).toEqual(false)
        expect(component.find('.error').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should load more check-ins when scrolling to the end of the page', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve([{ ...mockCheckin, id: `${new Date().getTime()}` }]),
            })
        )

        let component = null
        await act(async () => {
            component = mount(<Checkins />)
        })
        expect(global.fetch).toHaveBeenCalledTimes(1)
        component.update()

        expect(component.find('Checkin').exists()).toEqual(true)

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
            component = mount(<Checkins />)
        })
        expect(global.fetch).toHaveBeenCalledTimes(3)

        component.unmount()
        global.fetch.mockRestore()
    })
})
