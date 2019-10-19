import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import Spotify from '../index'

export const mockUser = {
    id: '1231606952',
    name: 'Syte User',
    url: 'https://open.spotify.com/user/1231606952',
    picture: 'https://scontent.xx.fbcdn.net/762233502138656859_n.jpg',
}

describe('Spotify', () => {
    afterAll(() => {
        jest.resetAllMocks()
    })

    it('should fetch the spotify user', async () => {
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
            component = mount(<Spotify />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('.profile').exists()).toEqual(true)
        expect(component.find('RecentTracks').exists()).toEqual(true)
        expect(component.find('Top').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should display an error message if it fails to get the spotify user', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject())

        let component = null
        await act(async () => {
            component = mount(<Spotify />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('Error').exists()).toEqual(true)
        expect(component.find('.profile').exists()).toEqual(false)
        expect(component.find('RecentTracks').exists()).toEqual(false)
        expect(component.find('Top').exists()).toEqual(false)

        component.unmount()
        global.fetch.mockRestore()
    })
})
