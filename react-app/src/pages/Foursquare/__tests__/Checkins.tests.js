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

    it('should fetch and display a list of check-ins', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve({ data: [mockCheckin] }),
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
                json: () => Promise.resolve({ data: [{ ...mockCheckin, id: `${new Date().getTime()}` }] }),
            })
        )

        mockDate('2019-11-20T11:01:58.135Z')

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
                json: () => Promise.resolve({ data: [] }),
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

    it('should fetch the last 2 months of checkins if it is the first half of the month', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve({ data: [mockCheckin] }),
            })
        )

        mockDate('2019-11-01T11:01:58.135Z')
        let component = null
        await act(async () => {
            component = mount(<Checkins />)
        })
        expect(global.fetch).toHaveBeenCalledTimes(2)

        component.unmount()
        global.fetch.mockRestore()
    })
})
