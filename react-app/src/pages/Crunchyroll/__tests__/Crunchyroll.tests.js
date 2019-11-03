import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import Crunchyroll from '../index'

export const mockUser = {
    username: 'syte3',
    picture: 'https://img1.ak.crunchyroll.com/i/spire2/picture.jpg',
}

describe('Crunchyroll', () => {
    afterAll(() => {
        jest.resetAllMocks()
    })

    it('should fetch the crunchyroll user', async () => {
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
            component = mount(<Crunchyroll />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('Profile').exists()).toEqual(true)
        expect(component.find('RecentActivity').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should display an error message if it fails to get the crunchyroll user', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject())

        let component = null
        await act(async () => {
            component = mount(<Crunchyroll />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('Error').exists()).toEqual(true)
        expect(component.find('Profile').exists()).toEqual(false)
        expect(component.find('RecentActivity').exists()).toEqual(false)

        component.unmount()
        global.fetch.mockRestore()
    })
})
