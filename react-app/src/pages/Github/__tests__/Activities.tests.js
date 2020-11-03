import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import Activities from '../Activities'

const mockActivity = {
    id: '12345',
    icon: 'git-commit',
    date: '2019-10-16T02:21:11.000Z',
    description:
        'Pushed 1 commit to <strong>master</strong> at <a href="https://github.com/rigoneri/Syte3" target="_blank">rigoneri/Syte3</a> ',
}

describe('Activities', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    afterAll(() => {
        jest.resetAllMocks()
    })

    it('should fetch the github recent activity', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve({
                        data: [mockActivity],
                        nextPage: null,
                    }),
            })
        )

        let component = null
        await act(async () => {
            component = mount(<Activities />)
        })
        expect(global.fetch).toHaveBeenCalled()
        component.update()
        expect(component.find('h3').exists()).toEqual(true)
        expect(component.find('ul').exists()).toEqual(true)
        expect(component.find('.error').exists()).toEqual(false)
        expect(component.find('.empty').exists()).toEqual(false)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should display an error message if it fails to fetch recent activity', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject())

        let component = null
        await act(async () => {
            component = mount(<Activities />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('h3').exists()).toEqual(true)
        expect(component.find('ul').exists()).toEqual(false)
        expect(component.find('.error').exists()).toEqual(true)
        expect(component.find('.empty').exists()).toEqual(false)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should display an empty message if there is no recent activity', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve({
                        data: [],
                        nextPage: null,
                    }),
            })
        )

        let component = null
        await act(async () => {
            component = mount(<Activities />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('h3').exists()).toEqual(true)
        expect(component.find('ul').exists()).toEqual(false)
        expect(component.find('.error').exists()).toEqual(false)
        expect(component.find('.empty').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })
})
