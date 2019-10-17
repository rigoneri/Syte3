import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import Dribbble from '../index'

export const mockUser = {
    id: 12345,
    name: 'SyteS User',
    username: 'syte3',
    url: 'https://dribbble.com/syte3',
    picture: 'https://cdn.dribbble.com/users/1/avatars/normal/new-avatar.png',
    followers: 94,
    bio: 'Some description...',
}

describe('Dribbble', () => {
    afterAll(() => {
        jest.resetAllMocks()
    })

    it('should fetch the dribbble user', async () => {
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
            component = mount(<Dribbble />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('Profile').exists()).toEqual(true)
        expect(component.find('Shots').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should display an error message if it fails to get the dribbble user', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject())

        let component = null
        await act(async () => {
            component = mount(<Dribbble />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('Error').exists()).toEqual(true)
        expect(component.find('Profile').exists()).toEqual(false)
        expect(component.find('Shots').exists()).toEqual(false)

        component.unmount()
        global.fetch.mockRestore()
    })
})
