import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import Foursquare from '../index'

export const mockUser = {
    id: '8786308',
    name: 'Syte User',
    url: 'https://foursquare.com/syteuser',
    checkins: 1951,
    friends: 54,
    location: 'Some City, ST',
    picture: 'https://fastly.4sqi.net/img/user/260x260/8786308_l39eLB6S',
}

describe('Foursquare', () => {
    afterAll(() => {
        jest.resetAllMocks()
    })

    it('should fetch the foursquare user', async () => {
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
            component = mount(<Foursquare />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('Profile').exists()).toEqual(true)
        expect(component.find('Checkins').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should display an error message if it fails to get the foursquare user', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject())

        let component = null
        await act(async () => {
            component = mount(<Foursquare />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('Error').exists()).toEqual(true)
        expect(component.find('Profile').exists()).toEqual(false)
        expect(component.find('Checkins').exists()).toEqual(false)

        component.unmount()
        global.fetch.mockRestore()
    })
})
