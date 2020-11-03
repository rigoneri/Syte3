import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import Github from '../index'

export const mockUser = {
    id: '1234',
    name: 'Syte3 User',
    username: 'syte3',
    followers: 189,
    following: 16,
    repos: [
        {
            id: '12345',
            name: 'Repo',
            url: 'https://github.com/some/repo',
            updated: '2019-09-30T14:08:47Z',
            description: 'Some repo',
            language: 'JavaScript',
            forks: 56,
            favorites: 187,
        },
    ],
    picture: 'https://avatars2.githubusercontent.com/u/0?v=4',
    url: 'https://github.com/syte3',
    description: 'Some description...',
}

describe('Github', () => {
    afterAll(() => {
        jest.resetAllMocks()
    })

    it('should fetch the github user', async () => {
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
            component = mount(<Github />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('Profile').exists()).toEqual(true)
        expect(component.find('Repos').exists()).toEqual(true)
        expect(component.find('Activities').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should display an error message if it fails to get the github user', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject())

        let component = null
        await act(async () => {
            component = mount(<Github />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('Error').exists()).toEqual(true)
        expect(component.find('Profile').exists()).toEqual(false)
        expect(component.find('Repos').exists()).toEqual(false)
        expect(component.find('Activities').exists()).toEqual(false)

        component.unmount()
        global.fetch.mockRestore()
    })
})
