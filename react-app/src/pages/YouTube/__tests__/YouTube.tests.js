import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import YouTube from '../index'

export const mockUser = {
    id: 'UCll0NBAw',
    name: 'Syte User',
    url: 'https://www.youtube.com/channel/UCll0NBA',
    picture: 'https://yt3.ggpht.com/a/AGF-l7_T-zYUQRHs',
    subscribers: '87',
    banner: 'https://yt3.ggpht.com/4FQvdzh1uozqiyqlj3HAU',
}

describe('YouTube', () => {
    afterAll(() => {
        jest.resetAllMocks()
    })

    it('should fetch the youtube user', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(url => {
            if (url.includes('/user')) {
                return Promise.resolve({
                    json: () => Promise.resolve(mockUser),
                })
            } else {
                return Promise.reject()
            }
        })

        let component = null
        await act(async () => {
            component = mount(<YouTube />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('Error').exists()).toEqual(false)
        expect(component.find('Profile').exists()).toEqual(true)
        expect(component.find('Videos').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should display an error message if it fails to get the youtube user', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject())

        let component = null
        await act(async () => {
            component = mount(<YouTube />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('Error').exists()).toEqual(true)
        expect(component.find('Profile').exists()).toEqual(false)
        expect(component.find('Videos').exists()).toEqual(false)

        component.unmount()
        global.fetch.mockRestore()
    })
})
