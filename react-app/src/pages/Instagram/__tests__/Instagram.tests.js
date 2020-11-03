import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import Instagram from '../index'

export const mockUser = {
    id: '1326084',
    username: 'syte3',
    full_name: 'Syte User',
    counts: {
        media: 661,
    },
    url: 'https://instagram.com/syte3',
}

describe('Instagram', () => {
    afterAll(() => {
        jest.resetAllMocks()
    })

    it('should fetch the instagram user', async () => {
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
            component = mount(<Instagram />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('Profile').exists()).toEqual(true)
        expect(component.find('Posts').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should display an error message if it fails to get the instagram user', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject())

        let component = null
        await act(async () => {
            component = mount(<Instagram />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('Error').exists()).toEqual(true)
        expect(component.find('Profile').exists()).toEqual(false)
        expect(component.find('Posts').exists()).toEqual(false)

        component.unmount()
        global.fetch.mockRestore()
    })
})
