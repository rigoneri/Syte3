import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import RecentActivity from '../RecentActivity'

export const mockActivity = {
    id: 'a5503febba74146380413a6676ff6adb3a427eb0',
    date: '2019-11-02T22:41:03.847Z',
    description: 'Episode 16 - A Tale for the Ages',
    lastUpdated: '2019-11-02T22:41:03.852Z',
    picture: 'https://img1.ak.crunchyroll.com/i/spire4-tmb/01b8fa3b63f126394e5496f12f8ebc621571387760_wide.jpg',
    title: 'Dr. STONE',
    type: 'crunchyroll',
    url: 'http://www.crunchyroll.com/dr-stone/episode-16-a-tale-for-the-ages-789329',
}

describe('RecentActivity', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    afterAll(() => {
        jest.resetAllMocks()
    })

    it('should fetch and display a list of watched crunchyroll videos', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve([mockActivity]),
            })
        )

        let component = null
        await act(async () => {
            component = mount(<RecentActivity />)
        })
        expect(global.fetch).toHaveBeenCalled()
        component.update()
        expect(component.find('.activities ul li').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should display an error message if it fails to fetch watched crunchyroll videos', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject())

        let component = null
        await act(async () => {
            component = mount(<RecentActivity />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('.activities ul li').exists()).toEqual(false)
        expect(component.find('.error').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })
})
