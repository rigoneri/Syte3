import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import Repos from '../Repos'

const mockRepo = {
    id: '12345',
    name: 'Repo',
    url: 'https://github.com/some/repo',
    updated: '2019-09-30T14:08:47Z',
    description: 'Some repo',
    language: 'JavaScript',
    forks: 56,
    favorites: 187,
}

describe('Github', () => {
    afterAll(() => {
        jest.resetAllMocks()
    })

    it('should fetch the github list of repos', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve([mockRepo]),
            })
        )

        let component = null
        await act(async () => {
            component = mount(<Repos />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('h3').exists()).toEqual(true)
        expect(component.find('ul').exists()).toEqual(true)
        expect(component.find('.error').exists()).toEqual(false)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should display an error message if it fails to fetch repos', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject())

        let component = null
        await act(async () => {
            component = mount(<Repos />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('h3').exists()).toEqual(true)
        expect(component.find('ul').exists()).toEqual(false)
        expect(component.find('.error').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should display a list of repos', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve([mockRepo]),
            })
        )

        let component = null
        await act(async () => {
            component = mount(<Repos />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('h3').exists()).toEqual(true)
        expect(component.find('ul').exists()).toEqual(true)
        expect(component.find('li').exists()).toEqual(true)
        expect(component.find(`a[href="${mockRepo.url}"]`).exists()).toEqual(true)
        expect(component.find('.stats').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })
})
